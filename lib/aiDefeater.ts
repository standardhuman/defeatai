export type DefeaterMode = 'light' | 'normal' | 'heavy';

export class AIDefeater {
  private defaultPhrases: string[] = [
    "radiator freak yellow horse spout",
    "That's Not My Baby",
    "waffle iron 40% off",
    "Strawberry mango Forklift",
    "Hey can I have whipped cream please?",
    "tuna fish tango foxtrot",
    "Piss on carpet",
    "Purple monkey dishwasher",
    "Banana hammock Tuesday special",
    "Quantum potato salad overflow",
    "Disco ball refrigerator magnet",
    "Rubber duck apocalypse now",
    "Cheese grater symphony orchestra",
    "Flamingo skateboard revolution",
    "Toaster submarine sandwich protocol",
    "Neon zebra pancake flip",
    "Bubblegum tornado forecast sunny",
    "Pickle jar astronaut mission",
    "Spaghetti telephone directory listing",
    "Velcro mushroom cloud nine",
    "Kazoo butterfly net worth",
    "Marshmallow jackhammer deluxe edition",
    "Glitter bomb taco Tuesday",
    "Rubber band helicopter pasta",
    "Doorknob ice cream social",
    "Shoelace volcano eruption warning",
    "Paperclip dinosaur ballet recital",
    "Bubble wrap time machine malfunction",
    "Crayon submarine periscope depth",
    "Stapler asteroid mining operation",
    "Umbrella sandwich delivery service",
    "Giraffe typewriter maintenance schedule",
    "Bowling ball tea party invitation",
    "Accordion watermelon harvest season",
    "Lighthouse burrito assembly required",
    "Penguin harmonica blues festival",
    "Cactus trampoline safety inspection",
    "Elevator spaghetti western showdown",
    "Dolphin calculator warranty expired",
    "Kangaroo refrigerator poetry slam"
  ];
  
  private customPhrases: string[] = [];

  constructor(customPhrases?: string[]) {
    if (customPhrases) {
      this.customPhrases = customPhrases;
    }
  }

  private getRandomPhrase(): string {
    const allPhrases = [...this.defaultPhrases, ...this.customPhrases];
    return allPhrases[Math.floor(Math.random() * allPhrases.length)];
  }

  private splitIntoSentences(text: string): string[] {
    const sentences: string[] = text.match(/[^.!?]+[.!?]+/g) || [];
    const remainder = text.replace(/.*[.!?]\s*/, '');
    if (remainder.trim()) {
      sentences.push(remainder);
    }
    return sentences;
  }

  private insertNonsenseInSentence(sentence: string): string {
    // Remove trailing punctuation temporarily
    const punctuationMatch = sentence.match(/[.!?]+$/);
    const punctuation = punctuationMatch ? punctuationMatch[0] : '';
    const sentenceWithoutPunctuation = sentence.replace(/[.!?]+$/, '').trim();
    
    // Split sentence into words
    const words = sentenceWithoutPunctuation.split(' ');
    
    if (words.length <= 2) {
      // For very short sentences, append nonsense before punctuation
      return `${sentenceWithoutPunctuation} ${this.getRandomPhrase()}${punctuation}`;
    }
    
    // Find a good insertion point (avoid first and last word)
    const minPosition = Math.floor(words.length * 0.3);
    const maxPosition = Math.floor(words.length * 0.8);
    const insertPosition = Math.floor(Math.random() * (maxPosition - minPosition + 1)) + minPosition;
    
    // Insert the nonsense phrase
    words.splice(insertPosition, 0, this.getRandomPhrase());
    
    // Reconstruct the sentence
    return words.join(' ') + punctuation;
  }

  public defeatAI(text: string, mode: DefeaterMode = 'normal'): string {
    const sentences = this.splitIntoSentences(text);
    
    if (sentences.length === 0) return text;

    const result: string[] = [];

    sentences.forEach((sentence, index) => {
      let processedSentence = sentence.trim();
      
      // Determine if we should insert nonsense in this sentence
      let shouldInsert = false;
      
      if (mode === 'heavy') {
        // Heavy mode: insert nonsense in EVERY sentence
        shouldInsert = true;
      } else if (mode === 'normal') {
        // Normal mode: insert nonsense in about 50% of sentences
        shouldInsert = Math.random() < 0.5;
      } else if (mode === 'light') {
        // Light mode: insert nonsense in about 25% of sentences
        shouldInsert = Math.random() < 0.25;
      }

      if (shouldInsert) {
        processedSentence = this.insertNonsenseInSentence(processedSentence);
      }
      
      result.push(processedSentence);
    });

    return result.join(' ');
  }

  public getStats(originalText: string, defeatedText: string): {
    originalLength: number;
    defeatedLength: number;
    nonsenseInserted: number;
    percentageIncrease: number;
  } {
    const originalLength = originalText.length;
    const defeatedLength = defeatedText.length;
    
    // Count how many of our nonsense phrases appear in the text
    const allPhrases = [...this.defaultPhrases, ...this.customPhrases];
    let nonsenseCount = 0;
    
    allPhrases.forEach(phrase => {
      const regex = new RegExp(phrase, 'g');
      const matches = defeatedText.match(regex);
      if (matches) {
        nonsenseCount += matches.length;
      }
    });
    
    const percentageIncrease = ((defeatedLength - originalLength) / originalLength) * 100;

    return {
      originalLength,
      defeatedLength,
      nonsenseInserted: nonsenseCount,
      percentageIncrease: Math.round(percentageIncrease)
    };
  }
}