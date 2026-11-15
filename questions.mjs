export const readingText = {
  title: "Ein Tag in Leipzig",
  paragraphs: [
    "Hallo Nina! Am Samstag bin ich in Leipzig. Mein Zug kommt um 10:15 Uhr an. Ich warte vor dem Bahnhof.",
    "Um 11 Uhr gehen wir ins Café Morgenrot. Ein Kaffee kostet 3 Euro, ein Stück Kuchen 4 Euro.",
    "Am Nachmittag möchte ich ins Museum. Es ist von 13 bis 17 Uhr geöffnet. Kannst du mitkommen?",
    "Liebe Grüße, Alex"
  ]
};

export const questions = [
  {
    skill: "Vocabulary",
    prompt: "You want to buy bread rolls. Where do you go?",
    options: ["zur Bäckerei", "zum Bahnhof", "zur Apotheke", "ins Kino"],
    answer: 0,
    concept: "Everyday places",
    practice: {
      title: "Name everyday places",
      detail: "Review places around town and what you can do there: a bakery for bread, a pharmacy for medicine."
    }
  },
  {
    skill: "Vocabulary",
    prompt: "What does „am Dienstag“ tell you?",
    options: ["A place", "A day", "A price", "A person"],
    answer: 1,
    concept: "Days and time words",
    practice: {
      title: "Review days and time words",
      detail: "Practise weekdays and simple time phrases such as heute, morgen, am Montag and um neun Uhr."
    }
  },
  {
    skill: "Vocabulary",
    prompt: "A shop sign says „geschlossen“. What does it mean?",
    options: ["Open", "Closed", "Cheap", "New"],
    answer: 1,
    concept: "Useful signs",
    practice: {
      title: "Learn useful signs",
      detail: "Make a small set of everyday signs and opposites: geöffnet / geschlossen, Eingang / Ausgang."
    }
  },
  {
    skill: "Vocabulary",
    prompt: "Which question asks how much something costs?",
    options: ["Wie spät ist es?", "Wo wohnst du?", "Wie viel kostet das?", "Wie heißen Sie?"],
    answer: 2,
    concept: "Everyday questions",
    practice: {
      title: "Ask about prices",
      detail: "Say prices aloud and practise the question „Wie viel kostet …?“ with familiar objects."
    }
  },
  {
    skill: "Grammar",
    prompt: "Complete the sentence: „Ich ___ aus Indien.“",
    options: ["bist", "bin", "sind", "seid"],
    answer: 1,
    concept: "sein with ich",
    practice: {
      title: "Conjugate sein",
      detail: "Practise the present forms of sein in short introductions: ich bin, du bist, er/sie ist, wir sind."
    }
  },
  {
    skill: "Grammar",
    prompt: "Choose the correct article: „Ich kaufe ___ Apfel.“",
    options: ["ein", "eine", "einen", "einem"],
    answer: 2,
    concept: "Accusative articles",
    practice: {
      title: "Use articles for direct objects",
      detail: "Practise common accusative phrases: einen Apfel kaufen, eine Tasche suchen, ein Brot nehmen."
    }
  },
  {
    skill: "Grammar",
    prompt: "Complete the sentence: „Maria ___ heute Deutsch.“",
    options: ["lerne", "lernst", "lernt", "lernen"],
    answer: 2,
    concept: "Present-tense verb endings",
    practice: {
      title: "Match verbs to the subject",
      detail: "Write simple sentences with ich, du and er/sie, then check the present-tense verb ending."
    }
  },
  {
    skill: "Grammar",
    prompt: "Choose the natural word order: „___ beginnt der Film?“",
    options: ["Wann", "Beginnt wann", "Der Film wann", "Wann der Film"],
    answer: 0,
    concept: "Question word order",
    practice: {
      title: "Build simple questions",
      detail: "Practise question word + verb + person: Wann beginnt …? Wo wohnt …? Wie heißt …?"
    }
  },
  {
    skill: "Reading",
    prompt: "What time does Alex's train arrive?",
    passage: true,
    options: ["At 10:15", "At 10:50", "At 11:00", "At 13:00"],
    answer: 0,
    concept: "Find a time",
    practice: {
      title: "Scan for times",
      detail: "In a short message, circle every time first, then match it to the person or event it describes."
    }
  },
  {
    skill: "Reading",
    prompt: "Where will Alex wait for Nina?",
    passage: true,
    options: ["At the museum", "In the café", "In front of the station", "At home"],
    answer: 2,
    concept: "Find a place",
    practice: {
      title: "Scan for places",
      detail: "Practise matching place words to details in a message: vor dem Bahnhof, im Café, im Museum."
    }
  },
  {
    skill: "Reading",
    prompt: "How much do a coffee and a piece of cake cost together?",
    passage: true,
    options: ["3 Euro", "4 Euro", "6 Euro", "7 Euro"],
    answer: 3,
    concept: "Understand prices",
    practice: {
      title: "Compare prices in a message",
      detail: "Underline prices in short notices and add or compare them to answer a simple question."
    }
  },
  {
    skill: "Reading",
    prompt: "When is the museum open?",
    passage: true,
    options: ["From 10 to 15", "From 11 to 17", "From 13 to 17", "From 13 to 19"],
    answer: 2,
    concept: "Match opening hours",
    practice: {
      title: "Read opening hours",
      detail: "Practise reading short schedules and checking both the start and end time."
    }
  }
];
