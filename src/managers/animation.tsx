/**
 * animation.tsx
 * helps manage the animation of the spirit line dialogue
 */

import { DIALOGUE_TYPE } from '../constants';
import { AudioManager } from './audio.tsx'
import { getSpeedMode, SpeedMode } from '../globals';


export class AnimationManager {
  public isAnimating = false;
  public currentAnimatingText: string = '';

  private audio = new AudioManager();

  private getTimings(mode: SpeedMode): { waitTime: number, blipEvery: number } {
    return { waitTime: 10,  blipEvery: 6  };
    switch (mode) {
      case 'very-slow':  return { waitTime: 100, blipEvery: 20 };
      case 'slow':       return { waitTime: 60,  blipEvery: 12 };
      case 'normal':     return { waitTime: 20,  blipEvery: 6  };
      case 'fast':       return { waitTime: 10,  blipEvery: 4  };
      case 'very-fast':  return { waitTime: 5,   blipEvery: 2  };
      default:           return { waitTime: 20,  blipEvery: 6  };
    }
  }

  /** KK: shows the spirit dialogue letter by letter for a more engaging approach to dialogue */
  async animateSpiritText(
    fullText: string,
    currentTags: string[],
    getDialogueList: () => [number, string][],
    setDialogueList: (list: [number, string][]) => void,
    setPartialSpiritLine: (line: string | null) => void
  ) {
    let { waitTime, blipEvery } = this.getTimings(getSpeedMode());
    let current = "";

    this.isAnimating = true;
    this.currentAnimatingText = fullText;
    
    if (currentTags.indexOf('anim--') > -1) {
        waitTime = 45; 
        blipEvery = 3;
    }

    const initialList = getDialogueList();
    setDialogueList([...initialList, [DIALOGUE_TYPE['spirit'], '']]);
    setPartialSpiritLine('');

    for (let i = 0; i < fullText.length; i++) {
        if (!this.isAnimating) break;

        const char = fullText[i];
        current += char;
        
        setPartialSpiritLine(current);

        if (i % blipEvery === 0 && /[a-zA-Z0-9]/.test(char)) {
            this.audio.playDialogueBlip();
        }
    
        // KK: pause at end of sentence
        if (char === "." || char === "?" || char === "!") {
            await new Promise(res => setTimeout(res, 250));
        }

        await new Promise((r) => setTimeout(r, waitTime));
    }

    this.isAnimating = false;

    const newList = [...getDialogueList()];
    newList[newList.length - 1] = [DIALOGUE_TYPE['spirit'], fullText];
    setDialogueList(newList);

    setPartialSpiritLine(null);
  }

  /** KK: skips dialogue animation */
  skipAnimation(
    getDialogueList: () => [number, string][],
    setDialogueList: (list: [number, string][]) => void,
    setPartialSpiritLine: (line: string | null) => void
  ) {
    if (!this.isAnimating || !this.currentAnimatingText) return;
    this.isAnimating = false;
    const list = getDialogueList();
    list[list.length - 1] = [DIALOGUE_TYPE['spirit'], this.currentAnimatingText];
    setDialogueList(list);
    setPartialSpiritLine(null);
  }
}