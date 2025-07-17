export type DefeaterMode = 'light' | 'normal' | 'heavy';

export class AIDefeater {
  private defaultPhrases: string[] = [
    // Original classics
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
    "Kangaroo refrigerator poetry slam",

    // Technology meets absurd
    "WiFi hamster wheel malfunction",
    "Bluetooth spoon synchronization error",
    "Cloud storage refrigerator overflow",
    "GPS toothbrush navigation system",
    "USB banana port connection",
    "Ethernet cable spaghetti junction",
    "Firewall marshmallow defense protocol",
    "Database pickle jar corruption",
    "API doorknob authentication failed",
    "JavaScript coffee machine exception",
    "HTML soup tag parser",
    "CSS rainbow alignment issue",
    "Bitcoin mining goldfish bowl",
    "Cryptocurrency toilet paper shortage",
    "Blockchain vacuum cleaner verification",
    "NFT sandwich token expired",
    "Metaverse lawn mower simulator",
    "Virtual reality potato peeler",
    "Augmented reality sock drawer",
    "Machine learning cheese grater",

    // Office nonsense
    "Stapler rebellion committee meeting",
    "Printer ink cartridge conspiracy theory",
    "Conference room pineapple scheduling",
    "Spreadsheet cell division therapy",
    "PowerPoint slide deck shuffle",
    "Email attachment spaghetti sauce",
    "Zoom background banana hammock",
    "Microsoft Teams rubber duck",
    "Slack notification toaster oven",
    "Calendar appointment shoe polish",
    "Meeting agenda purple monkey",
    "Deadline extension waffle iron",
    "Project timeline disco ball",
    "Budget report pickled herring",
    "Performance review bubble wrap",

    // Kitchen chaos
    "Microwave popcorn nuclear fusion",
    "Dishwasher salmon swimming upstream",
    "Refrigerator door sociology experiment",
    "Blender smoothie time vortex",
    "Toaster bread quantum entanglement",
    "Coffee maker existential crisis",
    "Garbage disposal philosophy debate",
    "Kitchen sink maritime law",
    "Oven timer dimensional portal",
    "Spatula flip coin toss",
    "Whisk tornado warning system",
    "Measuring cup liquid democracy",
    "Cutting board wooden horse",
    "Can opener revolution manifesto",
    "Food processor identity crisis",

    // Transportation absurdity
    "Bicycle tire pressure philosophy",
    "Automobile windshield meditation",
    "Train station platform poetry",
    "Airplane wing flapping protocol",
    "Subway sandwich navigation system",
    "Bus stop bench therapeutic session",
    "Taxi meter metaphysical discussion",
    "Parking meter coin slot therapy",
    "Traffic light color blind testing",
    "Stop sign octagonal obsession",
    "Speed limit numerical anxiety",
    "Highway merge lane philosophy",
    "Toll booth existential payment",
    "Gas station pump handle zen",
    "Car wash soap bubble economics",

    // Weather phenomena
    "Rainbow unicorn precipitation forecast",
    "Tornado spin cycle warranty",
    "Hurricane lamp shade assembly",
    "Earthquake tectonic plate dining",
    "Blizzard snowflake personality test",
    "Thunderstorm drum solo practice",
    "Lightning rod conductor interview",
    "Fog machine visibility settings",
    "Hail storm ice cube delivery",
    "Drought water conservation meeting",
    "Flood insurance poetry reading",
    "Snow angel geometry lesson",
    "Icicle formation growth chart",
    "Wind turbine helicopter parent",
    "Barometric pressure anxiety disorder",

    // Animal kingdom madness
    "Elephant memory foam mattress",
    "Giraffe neck extension warranty",
    "Zebra stripe pattern recognition",
    "Lion mane styling gel",
    "Tiger stripe paint job",
    "Monkey banana stock market",
    "Penguin tuxedo rental service",
    "Polar bear ice cube factory",
    "Camel hump storage unit",
    "Rhino horn sharpening service",
    "Hippo mouth dental hygiene",
    "Kangaroo pouch package delivery",
    "Koala eucalyptus addiction treatment",
    "Sloth speed enhancement program",
    "Cheetah running shoes endorsement",

    // Space exploration
    "Astronaut helmet hair gel",
    "Rocket fuel coffee addiction",
    "Satellite dish washing service",
    "Space station laundry cycle",
    "Moon landing conspiracy smoothie",
    "Mars rover parking ticket",
    "Jupiter storm weather report",
    "Saturn ring tone download",
    "Comet tail styling products",
    "Asteroid mining union strike",
    "Black hole vacuum cleaner",
    "Galaxy spiral staircase design",
    "Nebula cloud storage service",
    "Supernova explosion warranty",
    "Alien abduction insurance policy",

    // Time and dimensions
    "Yesterday tomorrow confusion matrix",
    "Time zone jet lag therapy",
    "Daylight saving time heist",
    "Leap year calendar anxiety",
    "Minute hand exercise routine",
    "Hour glass sand shortage",
    "Second thoughts first aid",
    "Millennium bug debugging session",
    "Century plant growth hormone",
    "Decade anniversary reminder",
    "Week day name confusion",
    "Month end closing ceremony",
    "Year round seasonal depression",
    "Temporal paradox parking meter",
    "Chronometer watch repair shop",

    // Random combinations
    "Velcro shoe philosophy discussion",
    "Magnetic personality refrigerator door",
    "Elastic band music theory",
    "Plastic fork fine dining",
    "Paper airplane flight instructor",
    "Cardboard box moving meditation",
    "Aluminum foil conspiracy theory",
    "Rubber glove handshake protocol",
    "Glass ceiling renovation project",
    "Wooden spoon orchestra conductor",
    "Metal detector beach therapy",
    "Fabric softener personality disorder",
    "Leather jacket weather forecast",
    "Ceramic tile dance floor",
    "Concrete mixer philosophical debate"
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