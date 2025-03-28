// export const speak = (message: string) => {
//     if ('speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(message);
//       utterance.lang = 'en-US';
//       utterance.pitch = 1;
//       utterance.rate = 1;
//       window.speechSynthesis.speak(utterance);
//     } else {
//       console.warn("Speech synthesis not supported in this browser.");
//     }
//   };
  
export const speak = (message: string) => {
    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported.");
      return;
    }
  
    const synth = window.speechSynthesis;
  
    const speakNow = () => {
      const voices = synth.getVoices();
      
      // Try to find a female-sounding voice
      const femaleVoice =
        voices.find(voice =>
          /female|woman/i.test(voice.name + voice.voiceURI + voice.lang)
        ) ||
        voices.find(voice =>
          /Google US English/i.test(voice.name)
        ) || voices[0]; // fallback to first
  
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.voice = femaleVoice;
      utterance.lang = 'en-US';
      utterance.pitch = 1;
      utterance.rate = 1;
  
      synth.speak(utterance);
    };
  
    // On some browsers, voices may not be loaded instantly
    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = speakNow;
    } else {
      speakNow();
    }
  };
  