import { DATA_VERSION } from "@/lib/data";
import { getProfileStorageKey } from "@/lib/profiles";
import { readJSON, writeJSON } from "@/lib/storage";

export type QuizStats = {
  dataVersion: number;
  totalQuizzes: number;
  totalScore: number;
  lastScore: number;
  lastTotal: number;
};

export function createDefaultQuizStats(): QuizStats {
  return {
    dataVersion: DATA_VERSION,
    totalQuizzes: 0,
    totalScore: 0,
    lastScore: 0,
    lastTotal: 0,
  };
}

export function normalizeQuizStats(value: QuizStats | null): QuizStats {
  if (!value || typeof value !== "object") {
    return createDefaultQuizStats();
  }

  return {
    dataVersion: typeof value.dataVersion === "number" ? value.dataVersion : DATA_VERSION,
    totalQuizzes: Number.isFinite(value.totalQuizzes) ? value.totalQuizzes : 0,
    totalScore: Number.isFinite(value.totalScore) ? value.totalScore : 0,
    lastScore: Number.isFinite(value.lastScore) ? value.lastScore : 0,
    lastTotal: Number.isFinite(value.lastTotal) ? value.lastTotal : 0,
  };
}

export function loadQuizStats(profileId: string): QuizStats {
  const key = getProfileStorageKey(profileId, "quizStats");
  const stored = readJSON<QuizStats | null>(key, null);
  const next = normalizeQuizStats(stored);
  writeJSON(key, next);
  return next;
}

export function saveQuizStats(profileId: string, stats: QuizStats): void {
  const key = getProfileStorageKey(profileId, "quizStats");
  writeJSON(key, normalizeQuizStats(stats));
}

export function recordQuizResult(
  profileId: string,
  finalScore: number,
  totalQuestions: number,
): void {
  const previous = loadQuizStats(profileId);
  const next: QuizStats = {
    ...previous,
    dataVersion: DATA_VERSION,
    totalQuizzes: previous.totalQuizzes + 1,
    totalScore: previous.totalScore + finalScore,
    lastScore: finalScore,
    lastTotal: totalQuestions,
  };
  saveQuizStats(profileId, next);
}

export function mergeQuizStats(existing: QuizStats, imported: QuizStats): QuizStats {
  return {
    dataVersion: DATA_VERSION,
    totalQuizzes: existing.totalQuizzes + imported.totalQuizzes,
    totalScore: existing.totalScore + imported.totalScore,
    lastScore: imported.lastTotal > 0 ? imported.lastScore : existing.lastScore,
    lastTotal: imported.lastTotal > 0 ? imported.lastTotal : existing.lastTotal,
  };
}
