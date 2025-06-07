const chibi = {
  speak: (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  },
  setEmotion: (emotion) => {
    document.getElementById('chibi-img').src = `assets/chibi/${emotion}.gif`;
  }
};

// Ejemplo de uso
chibi.speak("¡Hola! Vamos a jugar");
chibi.setEmotion('happy');