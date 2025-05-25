export const PAGE_STATE = {
    "intro": 0,
    "activate": 1,
    "machine": 2,
    "info": 3,
    "settings": 4,
    "painting": 5
  };

export const DIALOGUE_TYPE = {'spirit': 0, 'self-speaking': 1, 'self-thinking': 2, 'machine': 3};

export const GENERATE_WAIT_TYPE = {
    'dialogue': -1,
    'wait_for_first': 0,
    'generated': 1,
    'wait_for_lily1': 2,
    'wait_for_lily2': 22,
    'wait_for_interpretations': 3,
    'only_continue_from_generate': 4
};

export const MEY_PORTRAIT_PATH = {
    'mey_def': './assets/images/mey_default.png',
    'mey_sea': './assets/images/mey_sea.png'
}

export const SPIRIT_NAME = "Mey";

export const MID_INTEGR_THRSH = 60;
export const LOW_INTEGR_THRSH = 10;

export const LEANINIG_INTERVAL = 0.15;

export const IMAGE_DIM = 500;

export const HIGH_BOUND = 0.90;
export const LOW_BOUND = 0.18;
export const UNLOCK_SCORE = 1.2;