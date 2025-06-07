import * as faceapi from 'face-api.js';
import { Chibi } from './chibi.js';

export class EyeTracker {
  constructor() {
    this.chibi = new Chibi();
    this.contactTimer = null;
    this.totalTime = 0;
  }

  async init() {
    await this.loadModels();
    await this.startCamera();
    this.detectLoop();
  }

  async loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('models');
  }

  async startCamera() {
    const video = document.getElementById('webcam');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  }

  detectLoop = async () => {
    const video = document.getElementById('webcam');
    const detections = await faceapi.detectAllFaces(video, 
      new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    
    if (detections.length > 0) {
      this.handleEyeContact(detections[0]);
    } else {
      this.resetTimer();
    }
    
    requestAnimationFrame(this.detectLoop);
  };

  handleEyeContact(detection) {
    const leftEye = detection.landmarks.getLeftEye();
    const rightEye = detection.landmarks.getRightEye();
    const isLooking = this.checkGazeDirection(leftEye, rightEye);

    if (isLooking) {
      if (!this.contactTimer) {
        this.contactTimer = Date.now();
        this.chibi.setEmotion('HAPPY');
      }
      this.totalTime += 0.1;
      this.chibi.updateEyeContact(this.totalTime);
    } else {
      this.resetTimer();
    }
  }

  checkGazeDirection(leftEye, rightEye) {
    // Lógica avanzada de dirección de mirada
    const eyeCenterX = (leftEye[0].x + rightEye[3].x) / 2;
    return eyeCenterX > 0.4 && eyeCenterX < 0.6;
  }

  resetTimer() {
    if (this.contactTimer) {
      const duration = (Date.now() - this.contactTimer) / 1000;
      this.saveSession(duration);
      this.contactTimer = null;
    }
  }
}