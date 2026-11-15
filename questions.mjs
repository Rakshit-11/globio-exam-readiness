export const readingText = {
  title: "Ein Tag in Leipzig",
  paragraphs: [
    "Hallo Nina! Am Samstag bin ich in Leipzig. Mein Zug kommt um 10:15 Uhr an. Ich warte vor dem Bahnhof.",
    "Um 11 Uhr gehen wir ins Café Morgenrot. Ein Kaffee kostet 3 Euro, ein Stück Kuchen 4 Euro.",
    "Am Nachmittag möchte ich ins Museum. Es ist von 13 bis 17 Uhr geöffnet. Kannst du mitkommen?",
    "Liebe Grüße, Alex"
  ]
};

export const diagnosticTags = {
  "Places & services": {
    title: "Place words in everyday situations",
    steps: [
      "0–5 min: List six places around town and one thing you do at each.",
      "5–12 min: Match picture or word cards (Bäckerei, Apotheke, Bahnhof) to short situations.",
      "12–20 min: Say three mini-dialogues asking for or giving a place."
    ]
  },
  "Days & time": {
    title: "Days and time phrases",
    steps: [
      "0–5 min: Write the weekdays in order and mark today and tomorrow.",
      "5–12 min: Match am Montag, morgen and um neun Uhr to a simple calendar.",
      "12–20 min: Say three plans using a day and a time."
    ]
  },
  "Negation on signs": {
    title: "Spot negation on signs",
    steps: [
      "0–5 min: Review nicht and kein with two familiar examples.",
      "5–12 min: Match geöffnet / nicht geöffnet and erlaubt / nicht erlaubt to meanings.",
      "12–20 min: Write and read aloud four short shop or building notices."
    ]
  },
  "Price questions": {
    title: "Ask and answer about prices",
    steps: [
      "0–5 min: Review numbers and prices from 1 to 20 euros.",
      "5–12 min: Practise „Wie viel kostet …?“ with five everyday objects.",
      "12–20 min: Role-play a short shop exchange, alternating the question and answer."
    ]
  },
  "sein forms": {
    title: "Choose the right form of sein",
    steps: [
      "0–5 min: Say ich bin, du bist, er/sie ist, wir sind, ihr seid, sie sind.",
      "5–12 min: Fill the gaps in six short introduction sentences.",
      "12–20 min: Record or rehearse a four-line introduction using sein."
    ]
  },
  "Accusative articles": {
    title: "Articles with things you buy",
    steps: [
      "0–5 min: Sort familiar nouns into der, die and das.",
      "5–12 min: Practise einen / eine / ein after kaufen and suchen.",
      "12–20 min: Make five short shopping sentences and check each article."
    ]
  },
  "Modal permission": {
    title: "Use dürfen to ask permission",
    steps: [
      "0–5 min: Compare dürfen (permission) with können (ability).",
      "5–12 min: Put darf / darfst / dürfen into six everyday requests.",
      "12–20 min: Role-play asking permission to take photos, sit down or open a window."
    ]
  },
  "Question word order": {
    title: "Put question words in order",
    steps: [
      "0–5 min: Review wann, wo, wie and was.",
      "5–12 min: Rearrange six word cards into question-word + verb + person.",
      "12–20 min: Ask and answer three questions about a daily plan."
    ]
  },
  "Time & schedules": {
    title: "Find times in schedules",
    steps: [
      "0–5 min: Review digital times and von … bis … .",
      "5–12 min: Read a short timetable; mark arrival, meeting and opening times.",
      "12–20 min: Answer three questions by pointing to the exact schedule detail."
    ]
  },
  "Places in messages": {
    title: "Locate places in a short message",
    steps: [
      "0–5 min: Review place phrases such as vor dem Bahnhof and im Café.",
      "5–12 min: Underline place words in a short A1 message.",
      "12–20 min: Match three questions (where? with whom? when?) to the relevant sentence."
    ]
  },
  "Prices & totals": {
    title: "Compare prices in a message",
    steps: [
      "0–5 min: Practise reading euro amounts aloud.",
      "5–12 min: Circle each price in a short notice and match it to an item.",
      "12–20 min: Add two prices and answer „Wie viel kostet das zusammen?“"
    ]
  },
  "Listening (not assessed)": {
    title: "Listen for key details",
    steps: [
      "0–5 min: Choose a short A1 audio with a transcript.",
      "5–12 min: Listen once for the topic, then again for a time and a place.",
      "12–20 min: Check the transcript and note which detail was easy to miss."
    ]
  },
  "Writing & speaking (not assessed)": {
    title: "Introduce yourself in writing and aloud",
    steps: [
      "0–5 min: Draft four lines with your name, home, language and a question.",
      "5–12 min: Read it aloud slowly, then try again without looking.",
      "12–20 min: Check the words with a teacher or trusted A1 learning resource."
    ]
  }
};

export const questions = [
  {
    skill: "Vocabulary",
    prompt: "You want to buy bread rolls. Where do you go?",
    options: ["zur Bäckerei", "zum Bahnhof", "zur Apotheke", "ins Kino"],
    answer: 0,
    tag: "Places & services"
  },
  {
    skill: "Vocabulary",
    prompt: "What does „am Dienstag“ tell you?",
    options: ["A place", "A day", "A price", "A person"],
    answer: 1,
    tag: "Days & time"
  },
  {
    skill: "Vocabulary",
    prompt: "A shop sign says „Heute nicht geöffnet“. What does it mean?",
    options: ["Open today", "Closed today", "Cheap today", "New today"],
    answer: 1,
    tag: "Negation on signs"
  },
  {
    skill: "Vocabulary",
    prompt: "Which question asks how much something costs?",
    options: ["Wie spät ist es?", "Wo wohnst du?", "Wie viel kostet das?", "Wie heißen Sie?"],
    answer: 2,
    tag: "Price questions"
  },
  {
    skill: "Grammar",
    prompt: "Complete the sentence: „Ich ___ aus Indien.“",
    options: ["bist", "bin", "sind", "seid"],
    answer: 1,
    tag: "sein forms"
  },
  {
    skill: "Grammar",
    prompt: "Choose the correct article: „Ich kaufe ___ Apfel.“",
    options: ["ein", "eine", "einen", "einem"],
    answer: 2,
    tag: "Accusative articles"
  },
  {
    skill: "Grammar",
    prompt: "Which sentence asks permission to take a photo?",
    options: ["Ich darf ein Foto machen.", "Ich kann ein Foto machen.", "Ich muss ein Foto machen.", "Ich möchte ein Foto machen."],
    answer: 0,
    tag: "Modal permission"
  },
  {
    skill: "Grammar",
    prompt: "Choose the natural word order: „___ beginnt der Film?“",
    options: ["Wann", "Beginnt wann", "Der Film wann", "Wann der Film"],
    answer: 0,
    tag: "Question word order"
  },
  {
    skill: "Reading",
    prompt: "What time does Alex's train arrive?",
    passage: true,
    options: ["At 10:15", "At 10:50", "At 11:00", "At 13:00"],
    answer: 0,
    tag: "Time & schedules"
  },
  {
    skill: "Reading",
    prompt: "Where will Alex wait for Nina?",
    passage: true,
    options: ["At the museum", "In the café", "In front of the station", "At home"],
    answer: 2,
    tag: "Places in messages"
  },
  {
    skill: "Reading",
    prompt: "How much do a coffee and a piece of cake cost together?",
    passage: true,
    options: ["3 Euro", "4 Euro", "6 Euro", "7 Euro"],
    answer: 3,
    tag: "Prices & totals"
  },
  {
    skill: "Reading",
    prompt: "When is the museum open?",
    passage: true,
    options: ["From 10 to 15", "From 11 to 17", "From 13 to 17", "From 13 to 19"],
    answer: 2,
    tag: "Time & schedules"
  }
];
