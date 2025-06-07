function checkPose(pose) {
  if (pose === 'hands_up') {
    console.log("¡Correcto! Manos arriba");
    chibi.speak("¡Muy bien! 🌟");
  }
}

// Ejemplo
checkPose('hands_up');