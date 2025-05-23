/** 
 * audio.tsx
 * helps manage audio on the machine page
 */

import { getVolume, subscribeVolume } from '../globals';

export class AudioManager {
  private audioA1 = new Audio("./assets/audio/B1.mp3");
  private audioA2 = new Audio("./assets/audio/A1.mp3");
  private clickSound = new Audio("./assets/audio/click.ogg");
  private dialogueSound = new Audio("./assets/audio/dialogue.ogg");

  private a1Prev = 0;
  private a2Prev = 0;

  private unsubscribeVol: () => void;

  constructor() {
    this.audioA1.preload = "auto";
    this.audioA2.preload = "auto";

    const initialVol = getVolume();
    [this.audioA1, this.audioA2, this.clickSound, this.dialogueSound]
      .forEach(a => { a.volume = initialVol; });

    this.unsubscribeVol = subscribeVolume(vol => {
      [this.audioA1, this.audioA2, this.clickSound, this.dialogueSound]
        .forEach(audio => { audio.volume = vol; });
    });
  }

  /** KK: function to switch the current audio based on machine state (dialogue or image generation) */
  public play(isDialogue: boolean) {
    const FADE_DURATION = 2000; // KK: these are in miliseconds
    const STEP_TIME = 100;  
    const STEPS = FADE_DURATION / STEP_TIME;
    const targetVol = getVolume();

    const fadeOut = (audio: HTMLAudioElement, callback: () => void) => {
        const step = audio.volume / STEPS;
        const fadeInterval = setInterval(() => {
            audio.volume = Math.max(0, audio.volume - step);
            if (audio.volume <= 0.01) {
                clearInterval(fadeInterval);
                audio.pause();
                callback();
            }
        }, STEP_TIME);
    };
    
    const fadeIn = (audio: HTMLAudioElement) => {
        audio.volume = 0;
        audio.loop = true;
        audio.play().catch(err => console.error("Audio failed to play:", err));

        const step = targetVol / STEPS;
        const fadeInterval = setInterval(() => {
            audio.volume = Math.min(targetVol, audio.volume + step);
            if (audio.volume >= targetVol - 0.01) {
                clearInterval(fadeInterval);
            }
        }, STEP_TIME);
    };

    if (!isDialogue) {
        fadeOut(this.audioA2, () => {
            this.audioA1.currentTime = this.a1Prev;
            this.a2Prev = this.audioA2.currentTime;
            console.log("starting A1 audio at: ", this.audioA1.currentTime);
            fadeIn(this.audioA1);
        });
    } else {
        fadeOut(this.audioA1, () => {
            this.audioA2.currentTime = this.a2Prev;
            this.a1Prev = this.audioA1.currentTime;
            console.log("starting A2 audio at: ", this.audioA2.currentTime);
            fadeIn(this.audioA2);
        });
    }
  }

  stop() {
    this.audioA1.pause();
    this.audioA1.currentTime = 0;
    this.audioA2.pause();
    this.audioA2.currentTime = 0;
  }

  public playClick() {
    this.clickSound.currentTime = 0;
    this.clickSound.play().catch(() => {});
  }

  public playDialogueBlip() {
    this.dialogueSound.currentTime = 0;
    this.dialogueSound.play().catch(() => {});
  }

  public dispose() {
    this.unsubscribeVol();
  }
}
