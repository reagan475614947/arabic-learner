import type { Phrase } from "@/lib/data";
import { DATA_VERSION, PHRASES } from "@/lib/data";
import { getProfileStorageKey } from "@/lib/profiles";
import { getTodayDateKey, readJSON, writeJSON } from "@/lib/storage";

export type KnowledgeStatus = "known" | "unknown";
export type ItemViewStatus = KnowledgeStatus | "unseen";
export type LearnFilter = "all" | "unseen" | "known" | "unknown";

export type LearnProgress = {
  dataVersion: number;
  studiedDate: string;
  studiedIds: string[];
  itemStatus: Record<string, KnowledgeStatus>;
};

export type SessionCounts = {
  all: number;
  unseen: number;
  unknown: number;
  known: number;
  studiedToday: number;
};

export function createDefaultLearnProgress(): LearnProgress {
  return {
    dataVersion: DATA_VERSION,
    studiedDate: getTodayDateKey(),
    studiedIds: [],
    itemStatus: {},
  };
}

function normalizePhraseId(value: unknown): string | null {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return `p${String(value).padStart(3, "0")}`;
  }

  if (typeof value !== "string") {
    return null;
  }

  const clean = value.trim().toLowerCase();
  if (!clean) {
    return null;
  }

  if (/^p\d+$/.test(clean)) {
    const numberPart = Number(clean.slice(1));
    if (!Number.isInteger(numberPart) || numberPart <= 0) {
      return null;
    }
    return `p${String(numberPart).padStart(3, "0")}`;
  }

  if (/^\d+$/.test(clean)) {
    const numberPart = Number(clean);
    if (!Number.isInteger(numberPart) || numberPart <= 0) {
      return null;
    }
    return `p${String(numberPart).padStart(3, "0")}`;
  }

  return null;
}

export function normalizeLearnProgress(value: LearnProgress | null): LearnProgress {
  if (!value || typeof value !== "object") {
    return createDefaultLearnProgress();
  }

  const studiedDate = typeof value.studiedDate === "string" ? value.studiedDate : getTodayDateKey();

  const studiedIds = Array.isArray(value.studiedIds)
    ? Array.from(
        new Set(
          value.studiedIds
            .map((id) => normalizePhraseId(id))
            .filter((id): id is string => typeof id === "string"),
        ),
      )
    : [];

  const itemStatus: Record<string, KnowledgeStatus> = {};
  if (value.itemStatus && typeof value.itemStatus === "object") {
    for (const [key, status] of Object.entries(value.itemStatus)) {
      const id = normalizePhraseId(key);
      if (id && (status === "known" || status === "unknown")) {
        itemStatus[id] = status;
      }
    }
  }

  return {
    dataVersion: typeof value.dataVersion === "number" ? value.dataVersion : DATA_VERSION,
    studiedDate,
    studiedIds,
    itemStatus,
  };
}

export function migrateLearnProgress(
  progress: LearnProgress,
  items: Phrase[] = PHRASES,
): LearnProgress {
  const validIds = new Set(items.map((item) => item.id));
  const itemStatus: Record<string, KnowledgeStatus> = {};
  for (const [key, status] of Object.entries(progress.itemStatus)) {
    const id = normalizePhraseId(key);
    if (id && validIds.has(id) && (status === "known" || status === "unknown")) {
      itemStatus[id] = status;
    }
  }

  const studiedIds = Array.from(
    new Set(
      progress.studiedIds
        .map((id) => normalizePhraseId(id))
        .filter((id): id is string => typeof id === "string" && validIds.has(id)),
    ),
  );

  return {
    dataVersion: DATA_VERSION,
    studiedDate: progress.studiedDate,
    studiedIds,
    itemStatus,
  };
}

export function loadLearnProgress(profileId: string): LearnProgress {
  const key = getProfileStorageKey(profileId, "learnProgress");
  const stored = readJSON<LearnProgress | null>(key, null);
  const parsed = migrateLearnProgress(normalizeLearnProgress(stored));
  const today = getTodayDateKey();
  const next = parsed.studiedDate === today ? parsed : { ...parsed, studiedDate: today, studiedIds: [] };
  writeJSON(key, next);
  return next;
}

export function saveLearnProgress(profileId: string, progress: LearnProgress): void {
  const key = getProfileStorageKey(profileId, "learnProgress");
  writeJSON(key, migrateLearnProgress(progress));
}

export function getItemStatus(progress: LearnProgress, itemId: string): ItemViewStatus {
  return progress.itemStatus[itemId] ?? "unseen";
}

export function markItemStatus(
  progress: LearnProgress,
  itemId: string,
  status: KnowledgeStatus,
): LearnProgress {
  const today = getTodayDateKey();
  const activeStudiedIds = progress.studiedDate === today ? progress.studiedIds : [];
  const studiedIds = activeStudiedIds.includes(itemId) ? activeStudiedIds : [...activeStudiedIds, itemId];

  return {
    dataVersion: DATA_VERSION,
    studiedDate: today,
    studiedIds,
    itemStatus: {
      ...progress.itemStatus,
      [itemId]: status,
    },
  };
}

export function getSessionCounts(items: Phrase[], progress: LearnProgress): SessionCounts {
  let unseen = 0;
  let unknown = 0;
  let known = 0;

  for (const item of items) {
    const status = getItemStatus(progress, item.id);
    if (status === "unseen") {
      unseen += 1;
      continue;
    }
    if (status === "unknown") {
      unknown += 1;
      continue;
    }
    known += 1;
  }

  return {
    all: items.length,
    unseen,
    unknown,
    known,
    studiedToday: progress.studiedDate === getTodayDateKey() ? progress.studiedIds.length : 0,
  };
}

export function getFilteredItems(
  items: Phrase[],
  progress: LearnProgress,
  filter: LearnFilter,
): Phrase[] {
  if (filter === "all") {
    return items;
  }
  return items.filter((item) => getItemStatus(progress, item.id) === filter);
}

export function getReviewQueue(items: Phrase[], progress: LearnProgress): Phrase[] {
  const unseen = getFilteredItems(items, progress, "unseen");
  const unknown = getFilteredItems(items, progress, "unknown");
  return [...unseen, ...unknown];
}
