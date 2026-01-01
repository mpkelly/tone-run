
import { GoogleGenAI, Modality } from "@google/genai";

const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

let audioCache: Record<string, AudioBuffer> = {};
let audioCtx: AudioContext | null = null;
let activeSource: AudioBufferSourceNode | null = null;
let currentRequestText: string | null = null;

/**
 * Stops any currently playing audio from this service.
 */
export const stopAudio = () => {
  if (activeSource) {
    try {
      activeSource.stop();
    } catch (e) {
      // Ignore errors if already stopped
    }
    activeSource = null;
  }
  window.speechSynthesis.cancel();
  currentRequestText = null;
};

export const playThaiWord = async (text: string) => {
  // 1. Cancel any previous speech or pending requests
  stopAudio();
  currentRequestText = text;

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }

  try {
    let audioBuffer: AudioBuffer;

    if (audioCache[text]) {
      audioBuffer = audioCache[text];
    } else {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      // Check if this request is still the relevant one
      if (currentRequestText !== text) return;

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("No audio data received");

      const rawData = decode(base64Audio);
      audioBuffer = await decodeAudioData(rawData, audioCtx, 24000, 1);
      audioCache[text] = audioBuffer;
    }

    // Check again before playing
    if (currentRequestText !== text) return;

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.onended = () => {
      if (activeSource === source) activeSource = null;
    };
    
    activeSource = source;
    source.start();
  } catch (error) {
    console.error("TTS Error:", error);
    
    // Final check before fallback
    if (currentRequestText === text) {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'th-TH';
      window.speechSynthesis.speak(msg);
    }
  }
};
