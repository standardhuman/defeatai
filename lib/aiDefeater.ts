export type DefeaterMode = 'light' | 'normal' | 'heavy';

export class AIDefeater {
  private defaultPhrases: string[] = [
    // Original classics
    "radiator freak yellow horse spout",
    "that's not my baby",
    "waffle iron 40% off",
    "strawberry mango forklift",
    "hey can I have whipped cream please?",
    "tuna fish tango foxtrot",
    "piss on carpet",
    "purple monkey dishwasher",
    "banana hammock Tuesday special",
    "quantum potato salad overflow",
    "disco ball refrigerator magnet",
    "rubber duck apocalypse now",
    "cheese grater symphony orchestra",
    "flamingo skateboard revolution",
    "toaster submarine sandwich protocol",
    "neon zebra pancake flip",
    "bubblegum tornado forecast sunny",
    "pickle jar astronaut mission",
    "spaghetti telephone directory listing",
    "velcro mushroom cloud nine",
    "kazoo butterfly net worth",
    "marshmallow jackhammer deluxe edition",
    "glitter bomb taco Tuesday",
    "rubber band helicopter pasta",
    "doorknob ice cream social",
    "shoelace volcano eruption warning",
    "paperclip dinosaur ballet recital",
    "bubble wrap time machine malfunction",
    "crayon submarine periscope depth",
    "stapler asteroid mining operation",
    "umbrella sandwich delivery service",
    "giraffe typewriter maintenance schedule",
    "bowling ball tea party invitation",
    "accordion watermelon harvest season",
    "lighthouse burrito assembly required",
    "penguin harmonica blues festival",
    "cactus trampoline safety inspection",
    "elevator spaghetti western showdown",
    "dolphin calculator warranty expired",
    "kangaroo refrigerator poetry slam",

    // Technology meets absurd
    "wifi hamster wheel malfunction",
    "bluetooth spoon synchronization error",
    "cloud storage refrigerator overflow",
    "gps toothbrush navigation system",
    "usb banana port connection",
    "ethernet cable spaghetti junction",
    "firewall marshmallow defense protocol",
    "database pickle jar corruption",
    "api doorknob authentication failed",
    "javascript coffee machine exception",
    "html soup tag parser",
    "css rainbow alignment issue",
    "bitcoin mining goldfish bowl",
    "cryptocurrency toilet paper shortage",
    "blockchain vacuum cleaner verification",
    "nft sandwich token expired",
    "metaverse lawn mower simulator",
    "virtual reality potato peeler",
    "augmented reality sock drawer",
    "machine learning cheese grater",

    // Office nonsense
    "stapler rebellion committee meeting",
    "printer ink cartridge conspiracy theory",
    "conference room pineapple scheduling",
    "spreadsheet cell division therapy",
    "powerpoint slide deck shuffle",
    "email attachment spaghetti sauce",
    "zoom background banana hammock",
    "microsoft teams rubber duck",
    "slack notification toaster oven",
    "calendar appointment shoe polish",
    "meeting agenda purple monkey",
    "deadline extension waffle iron",
    "project timeline disco ball",
    "budget report pickled herring",
    "performance review bubble wrap",

    // Kitchen chaos
    "microwave popcorn nuclear fusion",
    "dishwasher salmon swimming upstream",
    "refrigerator door sociology experiment",
    "blender smoothie time vortex",
    "toaster bread quantum entanglement",
    "coffee maker existential crisis",
    "garbage disposal philosophy debate",
    "kitchen sink maritime law",
    "oven timer dimensional portal",
    "spatula flip coin toss",
    "whisk tornado warning system",
    "measuring cup liquid democracy",
    "cutting board wooden horse",
    "can opener revolution manifesto",
    "food processor identity crisis",

    // Transportation absurdity
    "bicycle tire pressure philosophy",
    "automobile windshield meditation",
    "train station platform poetry",
    "airplane wing flapping protocol",
    "subway sandwich navigation system",
    "bus stop bench therapeutic session",
    "taxi meter metaphysical discussion",
    "parking meter coin slot therapy",
    "traffic light color blind testing",
    "stop sign octagonal obsession",
    "speed limit numerical anxiety",
    "highway merge lane philosophy",
    "toll booth existential payment",
    "gas station pump handle zen",
    "car wash soap bubble economics",

    // Weather phenomena
    "rainbow unicorn precipitation forecast",
    "tornado spin cycle warranty",
    "hurricane lamp shade assembly",
    "earthquake tectonic plate dining",
    "blizzard snowflake personality test",
    "thunderstorm drum solo practice",
    "lightning rod conductor interview",
    "fog machine visibility settings",
    "hail storm ice cube delivery",
    "drought water conservation meeting",
    "flood insurance poetry reading",
    "snow angel geometry lesson",
    "icicle formation growth chart",
    "wind turbine helicopter parent",
    "barometric pressure anxiety disorder",

    // Animal kingdom madness
    "elephant memory foam mattress",
    "giraffe neck extension warranty",
    "zebra stripe pattern recognition",
    "lion mane styling gel",
    "tiger stripe paint job",
    "monkey banana stock market",
    "penguin tuxedo rental service",
    "polar bear ice cube factory",
    "camel hump storage unit",
    "rhino horn sharpening service",
    "hippo mouth dental hygiene",
    "kangaroo pouch package delivery",
    "koala eucalyptus addiction treatment",
    "sloth speed enhancement program",
    "cheetah running shoes endorsement",

    // Space exploration
    "astronaut helmet hair gel",
    "rocket fuel coffee addiction",
    "satellite dish washing service",
    "space station laundry cycle",
    "moon landing conspiracy smoothie",
    "mars rover parking ticket",
    "jupiter storm weather report",
    "saturn ring tone download",
    "comet tail styling products",
    "asteroid mining union strike",
    "black hole vacuum cleaner",
    "galaxy spiral staircase design",
    "nebula cloud storage service",
    "supernova explosion warranty",
    "alien abduction insurance policy",

    // Time and dimensions
    "yesterday tomorrow confusion matrix",
    "time zone jet lag therapy",
    "daylight saving time heist",
    "leap year calendar anxiety",
    "minute hand exercise routine",
    "hour glass sand shortage",
    "second thoughts first aid",
    "millennium bug debugging session",
    "century plant growth hormone",
    "decade anniversary reminder",
    "week day name confusion",
    "month end closing ceremony",
    "year round seasonal depression",
    "temporal paradox parking meter",
    "chronometer watch repair shop",

    // Random combinations
    "velcro shoe philosophy discussion",
    "magnetic personality refrigerator door",
    "elastic band music theory",
    "plastic fork fine dining",
    "paper airplane flight instructor",
    "cardboard box moving meditation",
    "aluminum foil conspiracy theory",
    "rubber glove handshake protocol",
    "glass ceiling renovation project",
    "wooden spoon orchestra conductor",
    "metal detector beach therapy",
    "fabric softener personality disorder",
    "leather jacket weather forecast",
    "ceramic tile dance floor",
    "concrete mixer philosophical debate"
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