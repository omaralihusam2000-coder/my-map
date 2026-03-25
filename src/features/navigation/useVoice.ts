import { useState, useCallback, useRef, useEffect } from 'react';

function pickVoice(): { voice: SpeechSynthesisVoice | null; noArabic: boolean } {
  if (typeof window === 'undefined' || !window.speechSynthesis) return { voice: null, noArabic: true };
  const voices = window.speechSynthesis.getVoices();
  const iq = voices.find(v => v.lang === 'ar-IQ');
  if (iq) return { voice: iq, noArabic: false };
  const sa = voices.find(v => v.lang === 'ar-SA');
  if (sa) return { voice: sa, noArabic: false };
  const ar = voices.find(v => v.lang.startsWith('ar'));
  if (ar) return { voice: ar, noArabic: false };
  return { voice: null, noArabic: true };
}

export function useVoice() {
  const [muted, setMuted] = useState(false);
  const [noArabicVoice, setNoArabicVoice] = useState(false);
  const lastRef = useRef<{ text: string; ts: number } | null>(null);

  useEffect(() => {
    if (!window.speechSynthesis) return;
    const check = () => setNoArabicVoice(pickVoice().noArabic);
    check();
    window.speechSynthesis.addEventListener('voiceschanged', check);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', check);
  }, []);

  const speak = useCallback((text: string, cooldownMs = 20000) => {
    if (muted || !window.speechSynthesis) return;
    const now = Date.now();
    if (lastRef.current?.text === text && now - lastRef.current.ts < cooldownMs) return;
    lastRef.current = { text, ts: now };
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const { voice, noArabic } = pickVoice();
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      utter.lang = noArabic ? 'en-US' : 'ar-SA';
    }
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  }, [muted]);

  const toggleMute = useCallback(() => setMuted(m => !m), []);

  const cancelSpeech = useCallback(() => {
    window.speechSynthesis?.cancel();
    lastRef.current = null;
  }, []);

  return { speak, muted, toggleMute, noArabicVoice, cancelSpeech };
}
