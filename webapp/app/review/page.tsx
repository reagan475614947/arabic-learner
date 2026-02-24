"use client";

import { useEffect, useMemo, useState } from "react";
import { PHRASES } from "@/lib/data";
import { speakArabic } from "@/lib/audio";
import {
  createDefaultLearnProgress,
  getItemStatus,
  getReviewQueue,
  loadLearnProgress,
  markItemStatus,
  saveLearnProgress,
  type LearnProgress,
} from "@/lib/learnProgress";
import { getActiveProfile, loadProfilesState } from "@/lib/profiles";

export default function ReviewPage() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<LearnProgress>(createDefaultLearnProgress);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [audioMessage, setAudioMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState("");

  useEffect(() => {
    const profilesState = loadProfilesState();
    const activeProfile = getActiveProfile(profilesState);
    setActiveProfileId(activeProfile.id);
    setProgress(loadLearnProgress(activeProfile.id));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!activeProfileId) {
      return;
    }
    saveLearnProgress(activeProfileId, progress);
  }, [activeProfileId, loading, progress]);

  const reviewQueue = useMemo(() => getReviewQueue(PHRASES, progress), [progress]);
  const currentItem = reviewQueue[currentIndex];

  useEffect(() => {
    setCurrentIndex((previousIndex) => {
      if (reviewQueue.length === 0) {
        return 0;
      }
      if (previousIndex > reviewQueue.length - 1) {
        return reviewQueue.length - 1;
      }
      return previousIndex;
    });
  }, [reviewQueue.length]);

  function moveCard(step: number): void {
    setCurrentIndex((previousIndex) => {
      const max = reviewQueue.length - 1;
      const nextIndex = previousIndex + step;
      if (nextIndex < 0) {
        return 0;
      }
      if (nextIndex > max) {
        return max;
      }
      return nextIndex;
    });
    setShowAnswer(false);
    setAudioMessage("");
  }

  function markCurrentItem(status: "known" | "unknown"): void {
    if (!currentItem) {
      return;
    }

    setProgress((previous) => markItemStatus(previous, currentItem.id, status));
    setAudioMessage("");
    setShowAnswer(false);
  }

  async function onAudioClick(): Promise<void> {
    if (!currentItem) {
      return;
    }
    setIsSpeaking(true);
    setAudioMessage("Speaking...");
    const result = await speakArabic(currentItem.arabic);
    setIsSpeaking(false);
    setAudioMessage(result.ok ? "" : result.message ?? "Unable to play audio.");
  }

  if (loading) {
    return (
      <div className="page-shell">
        <h1>Review</h1>
        <div className="placeholder-card">Loading your review queue...</div>
      </div>
    );
  }

  if (!currentItem || reviewQueue.length === 0) {
    return (
      <div className="page-shell">
        <h1>Review</h1>
        <div className="placeholder-card">Review queue is empty. You are all caught up for now.</div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <h1>Review</h1>
      <p className="subtitle">Queue priority: Unseen first, then Unknown.</p>

      <section className="flashcard">
        <div className="phrase-header">
          <p className="flashcard-arabic">{currentItem.arabic}</p>
          <button
            className="app-button app-button-icon"
            type="button"
            onClick={onAudioClick}
            disabled={isSpeaking}
          >
            🔊
          </button>
        </div>
        {audioMessage ? <p className="inline-note">{audioMessage}</p> : null}
        {showAnswer ? (
          <div className="flashcard-answer">
            <p>{currentItem.transliteration}</p>
            <p>{currentItem.meaning}</p>
          </div>
        ) : (
          <p className="flashcard-hint">Press “Show answer” to reveal transliteration and meaning.</p>
        )}
      </section>

      <div className="button-row">
        <button className="app-button" onClick={() => setShowAnswer((value) => !value)} type="button">
          {showAnswer ? "Hide answer" : "Show answer"}
        </button>
      </div>

      <div className="button-row">
        <button className="app-button" onClick={() => moveCard(-1)} type="button" disabled={currentIndex === 0}>
          Prev
        </button>
        <button
          className="app-button"
          onClick={() => moveCard(1)}
          type="button"
          disabled={currentIndex === reviewQueue.length - 1}
        >
          Next
        </button>
      </div>

      <div className="button-row">
        <button className="app-button app-button-know" type="button" onClick={() => markCurrentItem("known")}>
          I know this
        </button>
        <button className="app-button app-button-unknown" type="button" onClick={() => markCurrentItem("unknown")}>
          I don't know
        </button>
      </div>

      <p className="status-line">
        Status:{" "}
        {getItemStatus(progress, currentItem.id) === "unknown" ? "Needs review" : "Unseen"}
      </p>
      <p className="subtitle">
        Queue item {currentIndex + 1} / {reviewQueue.length}
      </p>
    </div>
  );
}
