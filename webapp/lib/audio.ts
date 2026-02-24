export type SpeakResult = {
  ok: boolean;
  message?: string;
};

function hasSpeechSupport(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function waitForVoices(
  synth: SpeechSynthesis,
  timeoutMs: number = 1500,
): Promise<SpeechSynthesisVoice[]> {
  const immediate = synth.getVoices();
  if (immediate.length > 0) {
    return Promise.resolve(immediate);
  }

  return new Promise((resolve) => {
    let settled = false;

    const finish = (): void => {
      if (settled) {
        return;
      }
      settled = true;
      synth.removeEventListener("voiceschanged", onVoicesChanged);
      clearTimeout(timeoutId);
      resolve(synth.getVoices());
    };

    const onVoicesChanged = (): void => {
      finish();
    };

    const timeoutId = window.setTimeout(finish, timeoutMs);
    synth.addEventListener("voiceschanged", onVoicesChanged);
  });
}

export async function speakArabic(text: string): Promise<SpeakResult> {
  if (!hasSpeechSupport()) {
    return { ok: false, message: "TTS not supported in this browser." };
  }

  const cleanText = text.trim();
  if (!cleanText) {
    return { ok: false, message: "Nothing to speak." };
  }

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = "ar";

  const voices = await waitForVoices(synth);
  const arabicVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("ar"));
  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  return new Promise((resolve) => {
    let settled = false;

    const finish = (result: SpeakResult): void => {
      if (settled) {
        return;
      }
      settled = true;
      resolve(result);
    };

    utterance.onend = (): void => {
      finish({ ok: true });
    };

    utterance.onerror = (event): void => {
      const errorCode = event.error ? ` (${event.error})` : "";
      finish({ ok: false, message: `Speech failed${errorCode}.` });
    };

    try {
      synth.speak(utterance);
    } catch {
      finish({ ok: false, message: "Unable to start speech." });
    }
  });
}
