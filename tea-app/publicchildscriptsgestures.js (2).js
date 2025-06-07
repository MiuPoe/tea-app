import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { Chibi } from './chibi.js';

export class GestureGame {
  constructor() {
    this.chibi = new Chibi();
    this.poses = {
      HANDS_UP: {
        keypoints: [
          { part: 'leftWrist', position: { y: 0.2 } },
          { part: 'rightWrist', position: { y: 0.2 } }
        ],
        instruction: 'Levanta las manos'
      }
    };
  }

  async init() {
    this.net = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: 257
    });
    this.startGame('HANDS_UP');
  }

  async startGame(poseType) {
    const pose = this.poses[poseType];
    await this.chibi.speak(`Vamos a imitar: ${pose.instruction}`);
    
    setInterval(async () => {
      const userPose = await this.net.estimateSinglePose(
        document.getElementById('webcam')
      );
      this.checkPose(userPose, pose);
    }, 500);
  }

  checkPose(userPose, targetPose) {
    let correctPoints = 0;
    
    targetPose.keypoints.forEach(target => {
      const userKeypoint = userPose.keypoints.find(
        kp => kp.part === target.part
      );
      
      if (userKeypoint && 
          Math.abs(userKeypoint.position.y - target.position.y) < 0.1) {
        correctPoints++;
      }
    });

    if (correctPoints === targetPose.keypoints.length) {
      this.chibi.setEmotion('HAPPY');
      this.chibi.speak('¡Perfecto! 🎉');
    }
  }
}