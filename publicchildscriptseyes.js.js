let eyeContactTime = 0;

function trackEyeContact() {
  // Lógica de detección (simplificada)
  setInterval(() => {
    eyeContactTime += 0.1;
    console.log(`Contacto visual: ${eyeContactTime.toFixed(1)}s`);
  }, 100);
}

// Iniciar
trackEyeContact();