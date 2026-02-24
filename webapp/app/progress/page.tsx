"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { DATA_VERSION, PHRASES } from "@/lib/data";
import {
  createDefaultLearnProgress,
  getSessionCounts,
  loadLearnProgress,
  migrateLearnProgress,
  normalizeLearnProgress,
  saveLearnProgress,
  type LearnProgress,
} from "@/lib/learnProgress";
import {
  createProfile,
  deleteProfile,
  getActiveProfile,
  loadProfilesState,
  switchActiveProfile,
  type ProfilesState,
} from "@/lib/profiles";
import {
  createDefaultQuizStats,
  loadQuizStats,
  mergeQuizStats,
  normalizeQuizStats,
  saveQuizStats,
  type QuizStats,
} from "@/lib/quizStats";
import { getTodayDateKey } from "@/lib/storage";
import { PRIVACY_NOTICE_EN } from "@/lib/privacy";

type Notice = {
  type: "success" | "error";
  text: string;
};

type ImportPayload = {
  dataVersion: number;
  profile?: {
    id?: string;
    name?: string;
  };
  learnProgress?: LearnProgress;
  quizStats?: QuizStats;
};

function mergeLearnProgress(existing: LearnProgress, imported: LearnProgress): LearnProgress {
  const today = getTodayDateKey();
  const existingTodayIds = existing.studiedDate === today ? existing.studiedIds : [];
  const importedTodayIds = imported.studiedDate === today ? imported.studiedIds : [];
  const studiedIds = Array.from(new Set([...existingTodayIds, ...importedTodayIds]));

  return migrateLearnProgress({
    dataVersion: DATA_VERSION,
    studiedDate: today,
    studiedIds,
    itemStatus: {
      ...existing.itemStatus,
      ...imported.itemStatus,
    },
  });
}

function parseImportPayload(rawText: string): { payload?: ImportPayload; error?: string } {
  if (!rawText.trim()) {
    return { error: "Please paste JSON or upload a file first." };
  }

  try {
    const parsed = JSON.parse(rawText) as ImportPayload;
    if (!parsed || typeof parsed !== "object") {
      return { error: "Invalid JSON structure." };
    }

    if (typeof parsed.dataVersion !== "number") {
      return { error: "Missing or invalid dataVersion." };
    }

    if (!parsed.learnProgress && !parsed.quizStats) {
      return { error: "Import payload must include learnProgress or quizStats." };
    }

    return { payload: parsed };
  } catch {
    return { error: "JSON parse failed. Please check formatting." };
  }
}

function downloadJSON(filename: string, content: unknown): void {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [profilesState, setProfilesState] = useState<ProfilesState | null>(null);
  const [progress, setProgress] = useState<LearnProgress>(createDefaultLearnProgress);
  const [quizStats, setQuizStats] = useState<QuizStats>(createDefaultQuizStats);
  const [newProfileName, setNewProfileName] = useState("");
  const [importText, setImportText] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const state = loadProfilesState();
    const activeProfile = getActiveProfile(state);
    setProfilesState(state);
    setProgress(loadLearnProgress(activeProfile.id));
    setQuizStats(loadQuizStats(activeProfile.id));
    setLoading(false);
  }, []);

  const profileCounts = useMemo(() => getSessionCounts(PHRASES, progress), [progress]);
  const activeProfile = profilesState ? getActiveProfile(profilesState) : null;
  const averageScore = quizStats.totalQuizzes > 0 ? (quizStats.totalScore / quizStats.totalQuizzes).toFixed(1) : "0.0";

  function refreshForProfile(profileId: string): void {
    setProgress(loadLearnProgress(profileId));
    setQuizStats(loadQuizStats(profileId));
  }

  function onSwitchProfile(profileId: string): void {
    const nextState = switchActiveProfile(profileId);
    setProfilesState(nextState);
    setNotice(null);
    refreshForProfile(nextState.activeProfileId);
  }

  function onCreateProfile(): void {
    const result = createProfile(newProfileName);
    setProfilesState(result.state);
    if (result.error) {
      setNotice({ type: "error", text: result.error });
      return;
    }

    setNewProfileName("");
    setNotice({ type: "success", text: "Profile created and switched." });
    refreshForProfile(result.state.activeProfileId);
  }

  function onDeleteProfile(): void {
    if (!activeProfile) {
      return;
    }

    const result = deleteProfile(activeProfile.id);
    setProfilesState(result.state);
    if (result.error) {
      setNotice({ type: "error", text: result.error });
      return;
    }

    setNotice({ type: "success", text: "Profile deleted." });
    refreshForProfile(result.state.activeProfileId);
  }

  function resetProgress(): void {
    if (!activeProfile) {
      return;
    }

    const nextProgress = createDefaultLearnProgress();
    const nextQuizStats = createDefaultQuizStats();
    saveLearnProgress(activeProfile.id, nextProgress);
    saveQuizStats(activeProfile.id, nextQuizStats);
    setProgress(nextProgress);
    setQuizStats(nextQuizStats);
    setNotice({ type: "success", text: "Current profile progress reset." });
  }

  function exportProgress(): void {
    if (!activeProfile) {
      return;
    }

    const payload: ImportPayload & { exportedAt: string } = {
      dataVersion: DATA_VERSION,
      profile: {
        id: activeProfile.id,
        name: activeProfile.name,
      },
      learnProgress: progress,
      quizStats,
      exportedAt: new Date().toISOString(),
    };

    const dateKey = getTodayDateKey();
    const safeName = activeProfile.name.replace(/\s+/g, "-").toLowerCase();
    downloadJSON(`arabic-learner-${safeName}-${dateKey}.json`, payload);
    setNotice({ type: "success", text: "Export downloaded." });
  }

  async function onImportFile(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    setImportText(text);
    setNotice({ type: "success", text: "File loaded. Click Import progress to apply." });
    event.target.value = "";
  }

  function importProgress(): void {
    if (!activeProfile) {
      return;
    }

    const parsed = parseImportPayload(importText);
    if (parsed.error || !parsed.payload) {
      setNotice({ type: "error", text: parsed.error ?? "Invalid import payload." });
      return;
    }

    const importedLearn = parsed.payload.learnProgress
      ? migrateLearnProgress(normalizeLearnProgress(parsed.payload.learnProgress))
      : createDefaultLearnProgress();

    const importedQuiz = parsed.payload.quizStats
      ? normalizeQuizStats(parsed.payload.quizStats)
      : createDefaultQuizStats();

    const mergedLearn = mergeLearnProgress(progress, importedLearn);
    const mergedQuiz = mergeQuizStats(quizStats, importedQuiz);

    saveLearnProgress(activeProfile.id, mergedLearn);
    saveQuizStats(activeProfile.id, mergedQuiz);
    setProgress(mergedLearn);
    setQuizStats(mergedQuiz);
    setNotice({ type: "success", text: "Import successful." });
  }

  if (loading) {
    return (
      <div className="page-shell">
        <h1>Progress</h1>
        <div className="placeholder-card">Loading progress summary...</div>
      </div>
    );
  }

  const hasData =
    profileCounts.known > 0 ||
    profileCounts.unknown > 0 ||
    profileCounts.studiedToday > 0 ||
    quizStats.totalQuizzes > 0;

  return (
    <div className="page-shell">
      <h1>Progress</h1>
      <p className="subtitle">Data version: {DATA_VERSION}</p>

      {profilesState && activeProfile ? (
        <section className="placeholder-card profile-card">
          <div className="profile-row">
            <label htmlFor="profile-select">Profile</label>
            <select
              id="profile-select"
              className="app-select"
              value={activeProfile.id}
              onChange={(event) => onSwitchProfile(event.target.value)}
            >
              {profilesState.profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </div>

          <div className="profile-row">
            <input
              className="app-input"
              type="text"
              value={newProfileName}
              placeholder="New profile name"
              onChange={(event) => setNewProfileName(event.target.value)}
            />
            <button className="app-button" type="button" onClick={onCreateProfile}>
              Create
            </button>
            <button
              className="app-button app-button-danger"
              type="button"
              onClick={onDeleteProfile}
              disabled={profilesState.profiles.length <= 1}
            >
              Delete profile
            </button>
          </div>
        </section>
      ) : null}

      {notice ? (
        <p className={notice.type === "error" ? "inline-note inline-note-error" : "inline-note"}>
          {notice.text}
        </p>
      ) : null}

      {!hasData ? <p className="subtitle">No saved progress yet for this profile.</p> : null}

      <div className="stats-grid">
        <div className="placeholder-card">
          <p className="stat-label">Unseen</p>
          <p className="stat-value">{profileCounts.unseen}</p>
        </div>
        <div className="placeholder-card">
          <p className="stat-label">Unknown</p>
          <p className="stat-value">{profileCounts.unknown}</p>
        </div>
        <div className="placeholder-card">
          <p className="stat-label">Known</p>
          <p className="stat-value">{profileCounts.known}</p>
        </div>
        <div className="placeholder-card">
          <p className="stat-label">Studied today</p>
          <p className="stat-value">{profileCounts.studiedToday}</p>
        </div>
      </div>

      <div className="placeholder-card import-export-card">
        <p className="stat-label">Quiz summary</p>
        <p className="status-line">
          Total quizzes: {quizStats.totalQuizzes}, Average score: {averageScore}, Last score: {quizStats.lastScore} /{" "}
          {quizStats.lastTotal || 10}
        </p>

        <div className="button-row">
          <button className="app-button" type="button" onClick={exportProgress}>
            Export progress
          </button>
          <input type="file" accept="application/json" onChange={onImportFile} />
        </div>

        <textarea
          className="app-textarea"
          value={importText}
          placeholder="Paste exported JSON here"
          onChange={(event) => setImportText(event.target.value)}
          rows={8}
        />

        <div className="button-row">
          <button className="app-button" type="button" onClick={importProgress}>
            Import progress
          </button>
        </div>
      </div>

      <div className="button-row">
        <button className="app-button app-button-danger" type="button" onClick={resetProgress}>
          Reset progress
        </button>
      </div>

      <p className="privacy-notice">{PRIVACY_NOTICE_EN}</p>
    </div>
  );
}
