import { readJSON, removeValue, STORAGE_KEYS, writeJSON } from "@/lib/storage";

export type Profile = {
  id: string;
  name: string;
};

export type ProfilesState = {
  activeProfileId: string;
  profiles: Profile[];
};

const DEFAULT_PROFILE: Profile = {
  id: "guest",
  name: "Guest",
};

const LEGACY_MIGRATED_KEY = "arabic-learner.legacyMigrated.v1";

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

function normalizeName(value: string): string {
  return value.trim();
}

function normalizeProfilesState(value: ProfilesState | null): ProfilesState {
  if (!value || typeof value !== "object") {
    return {
      activeProfileId: DEFAULT_PROFILE.id,
      profiles: [DEFAULT_PROFILE],
    };
  }

  const profiles = Array.isArray(value.profiles)
    ? value.profiles
        .map((profile) => {
          if (!profile || typeof profile !== "object") {
            return null;
          }
          const id = typeof profile.id === "string" ? profile.id.trim() : "";
          const name = typeof profile.name === "string" ? normalizeName(profile.name) : "";
          if (!id || !name) {
            return null;
          }
          return { id, name };
        })
        .filter((profile): profile is Profile => profile !== null)
    : [];

  if (profiles.length === 0) {
    profiles.push(DEFAULT_PROFILE);
  }

  const activeProfileId = profiles.some((profile) => profile.id === value.activeProfileId)
    ? value.activeProfileId
    : profiles[0].id;

  return {
    activeProfileId,
    profiles,
  };
}

function saveProfilesState(state: ProfilesState): void {
  writeJSON(STORAGE_KEYS.profiles, state);
}

function generateProfileId(name: string): string {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "profile";

  return `${base}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1_000_000).toString(36)}`;
}

function migrateLegacyKeys(state: ProfilesState): void {
  if (!hasWindow()) {
    return;
  }

  const alreadyMigrated = window.localStorage.getItem(LEGACY_MIGRATED_KEY);
  if (alreadyMigrated === "true") {
    return;
  }

  const guestProfileId = state.profiles[0]?.id ?? DEFAULT_PROFILE.id;
  const guestLearnKey = getProfileStorageKey(guestProfileId, "learnProgress");
  const guestQuizKey = getProfileStorageKey(guestProfileId, "quizStats");

  if (!window.localStorage.getItem(guestLearnKey)) {
    const legacyLearn = window.localStorage.getItem(STORAGE_KEYS.legacyLearnProgress);
    if (legacyLearn) {
      window.localStorage.setItem(guestLearnKey, legacyLearn);
    }
  }

  if (!window.localStorage.getItem(guestQuizKey)) {
    const legacyQuiz = window.localStorage.getItem(STORAGE_KEYS.legacyQuizStats);
    if (legacyQuiz) {
      window.localStorage.setItem(guestQuizKey, legacyQuiz);
    }
  }

  window.localStorage.setItem(LEGACY_MIGRATED_KEY, "true");
}

export function loadProfilesState(): ProfilesState {
  const raw = readJSON<ProfilesState | null>(STORAGE_KEYS.profiles, null);
  const state = normalizeProfilesState(raw);
  saveProfilesState(state);
  migrateLegacyKeys(state);
  return state;
}

export function getActiveProfile(state: ProfilesState): Profile {
  return state.profiles.find((profile) => profile.id === state.activeProfileId) ?? state.profiles[0];
}

export function switchActiveProfile(profileId: string): ProfilesState {
  const state = loadProfilesState();
  if (!state.profiles.some((profile) => profile.id === profileId)) {
    return state;
  }
  const nextState = {
    ...state,
    activeProfileId: profileId,
  };
  saveProfilesState(nextState);
  return nextState;
}

export function createProfile(name: string): { state: ProfilesState; error?: string } {
  const cleanName = normalizeName(name);
  if (!cleanName) {
    return {
      state: loadProfilesState(),
      error: "Profile name is required.",
    };
  }

  const state = loadProfilesState();
  const exists = state.profiles.some(
    (profile) => profile.name.toLowerCase() === cleanName.toLowerCase(),
  );

  if (exists) {
    return {
      state,
      error: "Profile name already exists.",
    };
  }

  const profile: Profile = {
    id: generateProfileId(cleanName),
    name: cleanName,
  };

  const nextState: ProfilesState = {
    activeProfileId: profile.id,
    profiles: [...state.profiles, profile],
  };

  saveProfilesState(nextState);
  return { state: nextState };
}

export function deleteProfile(profileId: string): { state: ProfilesState; error?: string } {
  const state = loadProfilesState();
  if (!state.profiles.some((profile) => profile.id === profileId)) {
    return {
      state,
      error: "Profile not found.",
    };
  }

  removeValue(getProfileStorageKey(profileId, "learnProgress"));
  removeValue(getProfileStorageKey(profileId, "quizStats"));

  let profiles = state.profiles.filter((profile) => profile.id !== profileId);
  if (profiles.length === 0) {
    profiles = [DEFAULT_PROFILE];
  }

  const activeProfileId = profiles.some((profile) => profile.id === state.activeProfileId)
    ? state.activeProfileId
    : profiles[0].id;

  const nextState: ProfilesState = {
    activeProfileId,
    profiles,
  };

  saveProfilesState(nextState);
  return { state: nextState };
}

export function getProfileStorageKey(
  profileId: string,
  dataType: "learnProgress" | "quizStats",
): string {
  return `arabic-learner.profile.${encodeURIComponent(profileId)}.${dataType}`;
}
