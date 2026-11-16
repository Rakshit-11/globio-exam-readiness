export const sections = [
  {
    id: "Hören",
    english: "Listening",
    description: "Understand short everyday announcements and conversations."
  },
  {
    id: "Lesen",
    english: "Reading",
    description: "Find useful details in short messages, notices and schedules."
  },
  {
    id: "Schreiben",
    english: "Writing",
    description: "Complete a form and write short, practical messages."
  },
  {
    id: "Sprechen",
    english: "Speaking",
    description: "Introduce yourself, exchange simple questions and make a request."
  }
];

export const diagnosticTags = {
  "Times & changes": {
    title: "Catch times and changes in announcements",
    steps: [
      "0–5 min: Review clock times and the phrases heute, morgen and nicht … sondern.",
      "5–12 min: Listen to three short everyday messages; write down each time you hear.",
      "12–20 min: Replay and check one detail at a time: when, where or what changed."
    ]
  },
  "Everyday conversations": {
    title: "Listen for people, places and things",
    steps: [
      "0–5 min: Review familiar place words and common things to bring.",
      "5–12 min: Listen to three short conversations and note who meets where.",
      "12–20 min: Replay each one and answer Was? Wo? and Wann? aloud."
    ]
  },
  "Course announcements": {
    title: "Follow a simple course announcement",
    steps: [
      "0–5 min: Review weekdays, half-hour times and room numbers.",
      "5–12 min: Listen to three class updates and note what stayed the same.",
      "12–20 min: Retell each update with the new time and place."
    ]
  },
  "Notices & signs": {
    title: "Read the practical detail on a notice",
    steps: [
      "0–5 min: Review opening hours and payment words such as bar and Karte.",
      "5–12 min: Read three short shop or service notices and circle restrictions.",
      "12–20 min: Answer what is open, when, and how you can pay."
    ]
  },
  "Messages & invitations": {
    title: "Find the plan in a short message",
    steps: [
      "0–5 min: Review time and place phrases such as um vier and im Park.",
      "5–12 min: Read three short invitations and mark who, where and when.",
      "12–20 min: Reply to one invitation with a time, place and simple question."
    ]
  },
  "Schedules": {
    title: "Find a detail in a simple timetable",
    steps: [
      "0–5 min: Review digital times and the names of familiar places.",
      "5–12 min: Scan three small schedules for a destination and arrival time.",
      "12–20 min: Answer each question by matching the place to its exact time."
    ]
  }
};

export const tasks = [
  {
    id: "listen-bus-change",
    section: "Hören",
    kind: "choice",
    format: "Everyday announcement",
    prompt: "When does the bus to Potsdam leave today?",
    audioText: "Der Bus nach Potsdam fährt heute nicht um acht Uhr, sondern um acht Uhr zwanzig. Bitte steigen Sie am Bahnsteig zwei ein.",
    transcript: "Der Bus nach Potsdam fährt heute nicht um acht Uhr, sondern um acht Uhr zwanzig. Bitte steigen Sie am Bahnsteig zwei ein.",
    options: ["08:00", "08:20", "08:02", "09:20"],
    answer: 1,
    tag: "Times & changes"
  },
  {
    id: "listen-cinema",
    section: "Hören",
    kind: "choice",
    format: "Short voice message",
    prompt: "What should Karim bring?",
    audioText: "Hallo, Karim! Ich bin schon vor dem Kino. Bring bitte die Kinokarten mit. Wir treffen uns um sechs Uhr.",
    transcript: "Hallo, Karim! Ich bin schon vor dem Kino. Bring bitte die Kinokarten mit. Wir treffen uns um sechs Uhr.",
    options: ["A book", "The cinema tickets", "A jacket", "Something to drink"],
    answer: 1,
    tag: "Everyday conversations"
  },
  {
    id: "listen-course",
    section: "Hören",
    kind: "choice",
    format: "Course announcement",
    prompt: "Where does the German class meet today?",
    audioText: "Der Deutschkurs am Freitag beginnt heute um halb zehn. Wir treffen uns im Raum vier, nicht im Raum zwei.",
    transcript: "Der Deutschkurs am Freitag beginnt heute um halb zehn. Wir treffen uns im Raum vier, nicht im Raum zwei.",
    options: ["Room 2 at 09:00", "Room 4 at 09:30", "Room 2 at 09:30", "Room 4 at 10:00"],
    answer: 1,
    tag: "Course announcements"
  },
  {
    id: "read-notice",
    section: "Lesen",
    kind: "choice",
    format: "Shop notice",
    passage: "Bäckerei Morgen\nMontag–Freitag: 7–18 Uhr\nSamstag: 8–13 Uhr · Sonntag: geschlossen\nHeute nur Barzahlung. Keine Kartenzahlung.",
    prompt: "How can you pay at the bakery today?",
    options: ["Only by card", "Only in cash", "By card or cash", "The bakery is closed"],
    answer: 1,
    tag: "Notices & signs"
  },
  {
    id: "read-invitation",
    section: "Lesen",
    kind: "choice",
    format: "Personal message",
    passage: "Hallo Sara,\n\nunser Treffen ist morgen um 16 Uhr im Park. Bring bitte etwas zu trinken mit.\n\nBis dann!\nEva",
    prompt: "When does Eva want to meet Sara?",
    options: ["Today at 4 pm", "Tomorrow at 4 pm", "Tomorrow at 6 pm", "On Saturday morning"],
    answer: 1,
    tag: "Messages & invitations"
  },
  {
    id: "read-timetable",
    section: "Lesen",
    kind: "choice",
    format: "Bus timetable",
    passage: "Stadtbus 5\nBahnhof 09:10\nRathaus 09:18\nMarkt 09:24\nSprachschule 09:33",
    prompt: "When does bus 5 arrive at the language school?",
    options: ["09:10", "09:18", "09:24", "09:33"],
    answer: 3,
    tag: "Schedules"
  },
  {
    id: "write-form",
    section: "Schreiben",
    kind: "form",
    format: "Course registration form",
    prompt: "Complete this short form for a Saturday German course. Use your own details; every field is optional.",
    fields: [
      { id: "name", label: "Vorname", placeholder: "Your first name" },
      { id: "wohnort", label: "Wohnort", placeholder: "Your city" },
      { id: "telefon", label: "Telefonnummer", placeholder: "Optional" }
    ],
    review: ["The requested fields are filled in.", "The information is easy to read."]
  },
  {
    id: "write-change-plan",
    section: "Schreiben",
    kind: "writing",
    format: "Short message",
    prompt: "You cannot meet a friend at 17:00. Write a short message to apologize, suggest another time, and say where to meet.",
    placeholder: "Hallo …, es tut mir leid, …",
    review: ["I greeted the person.", "I explained the change and suggested a time and place.", "I used a simple closing."]
  },
  {
    id: "write-course-reply",
    section: "Schreiben",
    kind: "writing",
    format: "Reply to an invitation",
    prompt: "A local garden group invites you to a meeting. Write a short reply: say you would like to come, ask when the meeting starts, and ask what to bring.",
    placeholder: "Hallo …, danke für …",
    review: ["I said whether I can come.", "I asked about the start time.", "I asked what I should bring."]
  },
  {
    id: "speak-introduction",
    section: "Sprechen",
    kind: "speaking",
    format: "Self-introduction",
    prompt: "Introduce yourself to a new classmate.",
    cues: ["Your name", "Where you come from or live", "Languages you speak", "One hobby"],
    partnerPrompt: "Ask your classmate one simple question.",
    review: ["I said a few facts about myself.", "I asked my partner a question."]
  },
  {
    id: "speak-questions",
    section: "Sprechen",
    kind: "speaking",
    format: "Ask and answer questions",
    prompt: "Use the topic card Freizeit (free time). Ask your partner one question, then answer these questions in your own words.",
    cues: ["Was machst du gern?", "Wann machst du das?", "Mit wem?"],
    partnerPrompt: "Practise both roles with a partner, or ask and answer the questions aloud yourself.",
    review: ["I asked a simple question.", "I answered with a time, activity or person."]
  },
  {
    id: "speak-request",
    section: "Sprechen",
    kind: "speaking",
    format: "Make a request",
    prompt: "You are at a bakery. Ask for two bread rolls, ask the price, and respond politely.",
    cues: ["Two Brötchen, please", "Ask: Wie viel kostet das?", "Say thank you"],
    partnerPrompt: "Practise with another person as the bakery worker, or say both parts aloud.",
    review: ["I made a clear request.", "I asked a simple question and responded politely."]
  }
];
