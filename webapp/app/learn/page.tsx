"use client";

import { useEffect, useMemo, useState } from "react";
import { PHRASES } from "@/lib/data";
import { speakArabic } from "@/lib/audio";
import {
  createDefaultLearnProgress,
  getFilteredItems,
  getItemStatus,
  getSessionCounts,
  loadLearnProgress,
  type KnowledgeStatus,
  type LearnFilter,
  type LearnProgress,
  markItemStatus,
  saveLearnProgress,
} from "@/lib/learnProgress";
import { getActiveProfile, loadProfilesState } from "@/lib/profiles";

export default function LearnPage() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LearnFilter>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [audioMessage, setAudioMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progress, setProgress] = useState<LearnProgress>(createDefaultLearnProgress);
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

  const sessionCounts = useMemo(() => getSessionCounts(PHRASES, progress), [progress]);
  const filteredItems = useMemo(
    () => getFilteredItems(PHRASES, progress, filter),
    [progress, filter],
  );
  const currentItem = filteredItems[currentIndex];

  useEffect(() => {
    setCurrentIndex((previousIndex) => {
      if (filteredItems.length === 0) {
        return 0;
      }
      if (previousIndex > filteredItems.length - 1) {
        return filteredItems.length - 1;
      }
      return previousIndex;
    });
  }, [filteredItems.length]);

  function changeFilter(nextFilter: LearnFilter): void {
    setFilter(nextFilter);
    setCurrentIndex(0);
    setShowAnswer(false);
    setAudioMessage("");
  }

  function moveCard(step: number): void {
    setCurrentIndex((previousIndex) => {
      const max = filteredItems.length - 1;
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

  function markCurrentItem(status: KnowledgeStatus): void {
    if (!currentItem) {
      return;
    }

    setProgress((previous) => markItemStatus(previous, currentItem.id, status));
    setAudioMessage("");
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

  if (PHRASES.length === 0) {
    return (
      <div className="page-shell">
        <h1>Learn</h1>
        <div className="placeholder-card">No learning items available yet.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-shell">
        <h1>Learn</h1>
        <div className="placeholder-card">Loading your flashcards...</div>
      </div>
    );
  }

  const filterButtons: { key: LearnFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: sessionCounts.all },
    { key: "unseen", label: "Unseen", count: sessionCounts.unseen },
    { key: "known", label: "Known", count: sessionCounts.known },
    { key: "unknown", label: "Unknown", count: sessionCounts.unknown },
  ];

  return (
    <div className="page-shell">
      <h1>Learn</h1>
      <p className="subtitle">Studied today: {sessionCounts.studiedToday}</p>

      <div className="filter-bar">
        {filterButtons.map((button) => (
          <button
            key={button.key}
            type="button"
            className={`filter-pill ${filter === button.key ? "filter-pill-active" : ""}`}
            onClick={() => changeFilter(button.key)}
          >
            {button.label} ({button.count})
          </button>
        ))}
      </div>

      {filteredItems.length === 0 || !currentItem ? (
        <div className="placeholder-card">No items in this filter yet.</div>
      ) : (
        <>
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
              disabled={currentIndex === filteredItems.length - 1}
            >
              Next
            </button>
          </div>

          <div className="button-row">
            <button className="app-button app-button-know" onClick={() => markCurrentItem("known")} type="button">
              I know this
            </button>
            <button
              className="app-button app-button-unknown"
              onClick={() => markCurrentItem("unknown")}
              type="button"
            >
              I don't know
            </button>
          </div>

          <p className="status-line">
            Status:{" "}
            {getItemStatus(progress, currentItem.id) === "known"
              ? "Known"
              : getItemStatus(progress, currentItem.id) === "unknown"
                ? "Needs review"
                : "Unseen"}
          </p>
          <p className="subtitle">
            Card {currentIndex + 1} / {filteredItems.length}
          </p>
        </>
      )}
    </div>
  );
}
