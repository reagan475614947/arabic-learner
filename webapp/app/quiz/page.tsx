"use client";

import { useEffect, useState } from "react";
import { PHRASES, type Phrase } from "@/lib/data";
import { getActiveProfile, loadProfilesState } from "@/lib/profiles";
import { recordQuizResult } from "@/lib/quizStats";

type QuizQuestion = {
  id: string;
  arabic: string;
  transliteration: string;
  correctMeaning: string;
  options: string[];
};

const QUESTION_COUNT = 10;
const OPTION_COUNT = 4;

function shuffle<T>(values: T[]): T[] {
  const next = [...values];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function buildQuestions(items: Phrase[]): QuizQuestion[] {
  if (items.length < OPTION_COUNT) {
    return [];
  }

  const quizItems = shuffle(items).slice(0, Math.min(QUESTION_COUNT, items.length));

  return quizItems.map((item) => {
    const distractors = shuffle(
      items
        .filter((candidate) => candidate.id !== item.id)
        .map((candidate) => candidate.meaning),
    ).slice(0, OPTION_COUNT - 1);

    return {
      id: item.id,
      arabic: item.arabic,
      transliteration: item.transliteration,
      correctMeaning: item.meaning,
      options: shuffle([item.meaning, ...distractors]),
    };
  });
}

export default function QuizPage() {
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState("");

  const currentQuestion = questions[currentIndex];

  function startQuiz(): void {
    setLoading(true);
    setQuestions(buildQuestions(PHRASES));
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setSubmitted(false);
    setFinished(false);
    setLoading(false);
  }

  useEffect(() => {
    const profilesState = loadProfilesState();
    const activeProfile = getActiveProfile(profilesState);
    setActiveProfileId(activeProfile.id);
    startQuiz();
  }, []);

  function submitAnswer(option: string): void {
    if (!currentQuestion || submitted || finished) {
      return;
    }

    setSelectedOption(option);
    setSubmitted(true);
    if (option === currentQuestion.correctMeaning) {
      setScore((previous) => previous + 1);
    }
  }

  function nextStep(): void {
    if (!currentQuestion || !submitted || finished) {
      return;
    }

    if (currentIndex === questions.length - 1) {
      if (activeProfileId) {
        recordQuizResult(activeProfileId, score, questions.length);
      }
      setFinished(true);
      return;
    }

    setCurrentIndex((previous) => previous + 1);
    setSelectedOption(null);
    setSubmitted(false);
  }

  if (loading) {
    return (
      <div className="page-shell">
        <h1>Quiz</h1>
        <div className="placeholder-card">Loading your quiz...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="page-shell">
        <h1>Quiz</h1>
        <div className="placeholder-card">Not enough items to build a quiz yet.</div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="page-shell">
        <h1>Quiz</h1>
        <div className="placeholder-card">
          <p>
            Final score: {score} / {questions.length}
          </p>
        </div>
        <div className="button-row">
          <button className="app-button" onClick={startQuiz} type="button">
            Start new quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <h1>Quiz</h1>
      <p className="subtitle">
        Question {currentIndex + 1} / {questions.length}
      </p>

      <section className="flashcard">
        <p className="flashcard-arabic">{currentQuestion.arabic}</p>
        <p className="flashcard-hint">{currentQuestion.transliteration}</p>
      </section>

      <div className="quiz-options">
        {currentQuestion.options.map((option) => {
          const isCorrect = option === currentQuestion.correctMeaning;
          const isSelected = option === selectedOption;
          const optionClasses = [
            "quiz-option",
            submitted && isCorrect ? "quiz-option-correct" : "",
            submitted && isSelected && !isCorrect ? "quiz-option-wrong" : "",
          ]
            .join(" ")
            .trim();

          return (
            <button
              key={option}
              type="button"
              className={optionClasses}
              onClick={() => submitAnswer(option)}
              disabled={submitted}
            >
              {option}
            </button>
          );
        })}
      </div>

      {submitted ? (
        <p className="status-line">
          {selectedOption === currentQuestion.correctMeaning ? "Correct." : "Not quite."} Correct answer:{" "}
          {currentQuestion.correctMeaning}
        </p>
      ) : (
        <p className="status-line">Choose one option to continue.</p>
      )}

      <div className="button-row">
        <button className="app-button" type="button" onClick={nextStep} disabled={!submitted}>
          {currentIndex === questions.length - 1 ? "Finish quiz" : "Next question"}
        </button>
      </div>
    </div>
  );
}
