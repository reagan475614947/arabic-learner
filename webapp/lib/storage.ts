export const STORAGE_KEYS = {
  profiles: "arabic-learner.profiles",
  legacyLearnProgress: "arabic-learner.learnProgress",
  legacyQuizStats: "arabic-learner.quizStats",
} as const;

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

export function readJSON<T>(key: string, fallback: T): T {
  if (!hasWindow()) {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
      return fallback;
    }
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): boolean {
  if (!hasWindow()) {
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeValue(key: string): void {
  if (!hasWindow()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Intentionally ignored to keep UI resilient.
  }
}

export function getTodayDateKey(date: Date = new Date()): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
