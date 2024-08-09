import {RiTa} from 'rita';

export class MarkovScrambler {
    markovContent: any;
    sentenceEndsOriginal: Set<string>;

    constructor() {
        this.markovContent = RiTa.markov(3);
        this.sentenceEndsOriginal = new Set();
    }

    initialize(filePath: string) {
        let markovTxt: string;
        let markovTxtSntns: RegExpMatchArray | null;

        fetch(filePath)
        .then((res) => res.text())
        .then((text) => {
            markovTxt = text;
        })
        .then(() => {  
            markovTxt = markovTxt.replace(/\(.*?\)/g, "");
            markovTxt = markovTxt.replace(/"/g, "");
            markovTxt = markovTxt.replace(/\b[A-Z]+\b/g, "");
            markovTxt = markovTxt.replace(/\d+/g, "");
            markovTxt = markovTxt.replace(/\s+/g, " ").trim();
        })
        .then(() => {  
            markovTxtSntns = markovTxt.match(/.*?(\. |\? |\! |; )|.+$/g);

            if (!markovTxtSntns) {
                console.error("Machine Page: Markov Text Return Null");
            } else {
                markovTxtSntns.forEach((e: string) => {
                    this.markovContent.addText(e);
                })
            }
                
            this.sentenceEndsOriginal = new Set(this.markovContent.sentenceEnds)

        })
        .catch((e) => console.error(e));
    }

    generate() {
        return this.markovContent.generate();
    }

    markovScramble(inprompt: string) {
        this.markovContent.sentenceEnds = new Set(this.sentenceEndsOriginal);

        // Create tokenized list, choose a random word
        let inprompt_tokenized = RiTa.tokenize(inprompt.replace(/[$&+,:;=?@#|'<>.^*()%!-]/g, ""));  
        let random_index = Math.floor(Math.random() * inprompt_tokenized.length);
        let selected_word = inprompt_tokenized[random_index];
        let random_word: string | null = selected_word;
        let next_word = (random_index + 1 != inprompt_tokenized.length) ? 
                            inprompt_tokenized[random_index+1] : undefined;

        if (!this.markovContent.input.includes(random_word)) random_word = null;
        this.markovContent.sentenceEnds.add(next_word);

        let prompt = this.markovContent.generate(
            {"count": 1, "seed": random_word, "maxLength": 15});

        // Post-generation text clean-up
        if (random_word) prompt = prompt.substring(random_word.length);
        else prompt = prompt[0].toLowerCase() + prompt.substring(1);
        if (next_word && prompt.substring(prompt.length - next_word.length, prompt.length) == next_word)       
            prompt = prompt.substring(0, prompt.length - next_word.length);
        else prompt = prompt.substring(0, prompt.length - 1);
        
        // Inserting the text - need to make this smarter: create substring after first one not matching
        let word_pos = inprompt.search(selected_word) + selected_word.length + 1;
        
        let prompt_previous = inprompt.substring(0, word_pos);
        let prompt_insert = prompt;
        let prompt_after = inprompt.substring(word_pos);
        
        return prompt_previous + prompt_insert + ' ' + prompt_after;
    }
}