/** 
 * audio.tsx
 * helps manage audio on the machine page
 */

import { getMusicVolume, subscribeMusicVolume, getSfxVolume, subscribeSfxVolume } from '../globals';
export class AudioManager {
  private menu = new Audio("./assets/audio/MainMenu.ogg");

  private tutorial = new Audio("./assets/audio/Tutorial.ogg");
  private gener = new Audio("./assets/audio/CoreGeneration.ogg");
  private memGener = new Audio("./assets/audio/MemorabiliaGeneration.ogg");
  private dialog1 = new Audio("./assets/audio/Core1.ogg");
  private dialog2 = new Audio("./assets/audio/Core2.ogg");
  private dialog3 = new Audio("./assets/audio/Core3.ogg");
  private dialog4 = new Audio("./assets/audio/Memorabilia1.ogg");
  private dialog5 = new Audio("./assets/audio/Memorabilia2.ogg");
  private dialogEnd = new Audio("./assets/audio/Ending.ogg");

  private dialogueClick = new Audio("./assets/audio/ClickSound.ogg");
  
  private retrieveClick1 = new Audio("./assets/audio/Retrieve1.wav");
  private retrieveClick2 = new Audio("./assets/audio/Retrieve2.wav");
  private retrieveClick3 = new Audio("./assets/audio/Retrieve3.wav");
  
  private dialogueSoundReady = 0;
  private dialogueSound0 = new Audio("./assets/audio/Dialogue.wav");
  private dialogueSound1 = new Audio("./assets/audio/Dialogue.wav");
  private dialogueSound2 = new Audio("./assets/audio/Dialogue.wav");

  private all_music =     
    [this.menu, this.tutorial,
    this.gener, this.memGener,
    this.dialog1, this.dialog2,
    this.dialog3, this.dialog4,
    this.dialog5,this.dialogEnd
    ]

  private all_sfx =     
    [this.dialogueClick,
    this.retrieveClick1, this.retrieveClick2, this.retrieveClick3,
    this.dialogueSound0, this.dialogueSound1, this.dialogueSound2,
    ]

  private retrieve =
    [this.retrieveClick1, this.retrieveClick2, this.retrieveClick3]
    
  private dialogueSound =
    [this.dialogueSound0, this.dialogueSound1, this.dialogueSound2]

  private a1Prev = 0;
  private a2Prev = 0;

  private currentIndex = 0; // the music being played right now
  private playTime = 0; // track the music play time for smoother transition

  private unsubscribeMusic: () => void;
  private unsubscribeSfx:   () => void;

  constructor() {
    this.menu.preload = "auto";

    this.tutorial.preload = "auto";
    this.gener.preload = "auto";
    this.memGener.preload = "auto";
    this.dialog1.preload = "auto";
    this.dialog2.preload = "auto";
    this.dialog3.preload = "auto";
    this.dialog4.preload = "auto";
    this.dialog5.preload = "auto";
    this.dialogEnd.preload = "auto";
    
    this.dialogueClick.preload = "auto";
    
    this.retrieveClick1.preload = "auto";
    this.retrieveClick2.preload = "auto";
    this.retrieveClick3.preload = "auto";

    this.dialogueSound0.preload = "auto";
    this.dialogueSound1.preload = "auto";
    this.dialogueSound2.preload = "auto";

    // Set up callback function so that tracks can be interweaved, to prevent clipping    
    this.dialogueSound0.addEventListener("ended", () => {
      this.dialogueSoundReady = 0;
    });
    this.dialogueSound1.addEventListener("ended", () => {
      this.dialogueSoundReady = 1;
    });
    this.dialogueSound2.addEventListener("ended", () => {
      this.dialogueSoundReady = 2;
    });

    /** KK: set up music volume */
    const initialMusicVol = getMusicVolume();
    this.all_music.forEach(audio => { audio.volume = initialMusicVol; });

    this.unsubscribeMusic = subscribeMusicVolume(vol => {
    this.all_music.forEach(audio => { audio.volume = vol; });
    });

    /** KK: set up sfx volume */
    const initialSfxVol = getSfxVolume();
    this.all_sfx.forEach(audio => { audio.volume = initialSfxVol; });

    this.unsubscribeSfx = subscribeSfxVolume(vol => {
    this.all_sfx.forEach(audio => { audio.volume = vol; });
    });
  }

  /** KK: function to switch the current audio based on machine state (dialogue or image generation) */
  // index: the index of the music
  // restart: whether the music transitions with the same play time or not
  public play(index: number, restart: boolean) {
    console.log("playing " + index.toString());

    if (index == this.currentIndex) {
      return;
    }

    const FADE_DURATION = 2000; // KK: these are in miliseconds
    const FAST_FADE_DURATION = 1000; // KK: these are in miliseconds
    const STEP_TIME = 100;  
    const STEPS = FADE_DURATION / STEP_TIME;
    const FAST_STEPS = FAST_FADE_DURATION / STEP_TIME;
    const targetVol = getMusicVolume();

    const fadeOut = (audio: HTMLAudioElement, steps: number, callback: () => void) => {
        const step = audio.volume / steps;
        const fadeInterval = setInterval(() => {
            audio.volume = Math.max(0, audio.volume - step);
            if (audio.volume <= 0.01) {
                clearInterval(fadeInterval);
                audio.pause();
                callback();
            }
        }, STEP_TIME);
    };
    
    const fadeIn = (audio: HTMLAudioElement, steps: number) => {
        audio.volume = 0;
        audio.loop = true;
        audio.play().catch(err => console.error("Audio failed to play:", err));

        const step = targetVol / steps;
        const fadeInterval = setInterval(() => {
            audio.volume = Math.min(targetVol, audio.volume + step);
            if (audio.volume >= targetVol - 0.01) {
                clearInterval(fadeInterval);
            }
        }, STEP_TIME);
    };

    if (restart) {
      fadeOut(this.all_music[this.currentIndex], FAST_STEPS, () => {
          this.all_music[this.currentIndex].currentTime = 0;
          this.all_music[index].currentTime = 0;
          fadeIn(this.all_music[index], FAST_STEPS);
      });
    } else {
      this.all_music[index].currentTime = this.all_music[this.currentIndex].currentTime;
      fadeOut(this.all_music[this.currentIndex], STEPS, () => {});
      fadeIn(this.all_music[index], STEPS);
    }

    this.currentIndex = index;
  }

  stop() {
    this.all_music.forEach(audio => { 
      audio.pause();
      audio.currentTime = 0;
    });
  }

  fadeStop() {
    console.log("fading out");
    const FAST_FADE_DURATION = 1000; // KK: these are in miliseconds
    const STEP_TIME = 100;  
    const STEPS = FAST_FADE_DURATION / STEP_TIME;

    const step = this.all_music[this.currentIndex].volume / STEPS;
    const fadeInterval = setInterval(() => {
        this.all_music[this.currentIndex].volume =
          Math.max(0, this.all_music[this.currentIndex].volume - step);
          if (this.all_music[this.currentIndex].volume <= 0.01) {
              clearInterval(fadeInterval);
              this.all_music[this.currentIndex].pause();
          }
    }, STEP_TIME);
  }

  public playClick() {
    // console.log("playing click");
    // let i = Math.floor(Math.random() * this.dialogueClick.length);
    // this.dialogueClick[i].currentTime = 0;
    // this.dialogueClick[i].play().catch(() => {});
    this.dialogueClick.currentTime = 0;
    this.dialogueClick.play().catch(() => {});
  }

  public playRetrieved() {
    // console.log("playing retrieved");
    let i = Math.floor(Math.random() * this.retrieve.length);
    this.retrieve[i].currentTime = 0;
    this.retrieve[i].play().catch(() => {});
  }

  public playDialogueBlip() {
    this.dialogueSound[this.dialogueSoundReady].currentTime = 0;
    this.dialogueSound[this.dialogueSoundReady].play().catch(() => {});
  }

  public dispose() {
    this.unsubscribeMusic();
    this.unsubscribeSfx();
  }
}
