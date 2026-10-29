// Per-step coaching specs. Keys match the step ids in ask-ai/index.html (PHASES), so the page can
// send { passage, genre, stepId, notes } and the backend looks up the rest here.
//
// Each spec distils the corresponding section of "General Hermeneutics" (General Hermeneuics.pdf).
// Genre-specific rules come from "Special Hermeneutics" via the GENRES table.
//
//   goal      — what the reader is trying to do at this step
//   coach     — what the coach should help them see (the coach writes passage-specific cues from this)
//   avoid     — the pitfalls from the PDF for this step
//   done      — the finish line; `next_step_ready` is true only when notes meet it
//   needsNotes — whether feedback on written notes makes sense at this step

export const PHASE_ORDER = ["preparation", "observation", "interpretation", "imagination", "application"];

export const STEPS = {
  // ------------------------------------------------------------ Preparation
  "prep-assumptions": {
    phase: "preparation",
    title: "Name your assumptions",
    goal: "Name what you already carry to this passage so Scripture can correct it.",
    coach: "Help the reader notice which sermons, arguments, traditions, hopes or fears this particular passage tends to trigger. Prompt with what this passage is commonly used for or argued over, without taking a side.",
    avoid: "Pretending to have an empty mind; defending a favourite position before the text has spoken.",
    done: "At least one specific assumption, hope, fear or inherited argument is written down in the reader's own words.",
    needsNotes: true
  },
  "prep-prayer": {
    phase: "preparation",
    title: "Pray for humility",
    goal: "Depend on the Holy Spirit to open the eyes, and ask for a willingness to obey.",
    coach: "Invite the reader to pray specifically about their instinctive reaction to this passage. Do not write the prayer for them.",
    avoid: "Treating prayer as a formality; praying only for confirmation of what they already think.",
    done: "The reader says they have prayed or names what they asked for.",
    needsNotes: false
  },
  "prep-loosely": {
    phase: "preparation",
    title: "Hold expectations loosely",
    goal: "Treat first impressions as hunches to test, not verdicts to defend.",
    coach: "Ask for a rough first guess at what the passage means, then frame it as something to test against the text.",
    avoid: "Letting the first impression harden into a conclusion before observation.",
    done: "A one-sentence guess is written and the reader treats it as provisional.",
    needsNotes: true
  },
  "prep-obey": {
    phase: "preparation",
    title: "Commit to obey",
    goal: "Settle the question of obedience before studying.",
    coach: "Prompt the reader to complete: 'If this passage confronts me, I am willing to ...' Point to the passage's likely pressure points without telling them what to conclude.",
    avoid: "A vague, costless commitment.",
    done: "The reader has completed the sentence with something specific.",
    needsNotes: true
  },

  // ------------------------------------------------------------ Observation
  "obs-translation": {
    phase: "observation",
    title: "Choose a working translation",
    goal: "Pick one main study translation and note where other translations differ.",
    coach: "Explain why a formal or moderately formal translation helps observation here, and point to the specific verses in this passage where translations are likely to diverge (repeated words, connectives, figures of speech, unusual phrases). Name the words, not the verses' text.",
    avoid: "Resting a major conclusion on the unusual wording of one translation; using a paraphrase as the base for close study.",
    done: "A main translation is named and at least one place where translations differ is written down as a question.",
    needsNotes: true
  },
  "obs-read": {
    phase: "observation",
    title: "Read & reread",
    goal: "Read the passage slowly, more than once, before explaining it.",
    coach: "Suggest reading the surrounding book or section first if short, then reading silently for movement, aloud for emphasis, and again for repeated words, questions, contrasts and commands. Point to where this passage's mood or movement shifts.",
    avoid: "Assuming familiar passages are already understood.",
    done: "The reader has written the one-sentence form: 'This passage moves from ___ to ___.'",
    needsNotes: true
  },
  "obs-map": {
    phase: "observation",
    title: "Map the passage unit",
    goal: "Find where the complete thought begins and ends and label its movements.",
    coach: "Tell the reader which kinds of seams to look for in this passage (shift of speaker, topic, place, time, command, contrast or summary) and ask whether their chosen verse range is the smallest complete unit. Flag if the chosen range looks cut mid-thought.",
    avoid: "Studying a single verse by itself; forcing the passage into a sermon outline you already wanted.",
    done: "Unit boundaries are stated and the main movements are labelled in order.",
    needsNotes: true
  },
  "obs-observe": {
    phase: "observation",
    title: "Make observations",
    goal: "Write down what the text actually says before explaining what it means.",
    coach: "Work in two passes. Pass one (basic): people, speaker and audience, places, time, actions, commands, questions, promises, warnings, stated reasons, tone, unfamiliar terms. Pass two (close): repeated words and phrases, contrasts and comparisons, connectives and logic, time expressions, lists, cause and effect, grammar, literary structure, links to other Scripture. Pick the 2-4 categories that will be most fruitful in THIS passage and say where in it to look. Finish with the who/what/when/where/why/how sweep.",
    avoid: "Interpreting while observing; skipping the obvious facts to chase subtle ones; forcing an answer to something you do not understand yet.",
    done: "Observations cover both basic facts and at least some close details, and contain no explanations of meaning.",
    needsNotes: true
  },
  "obs-questions": {
    phase: "observation",
    title: "Build the question log",
    goal: "Collect honest questions before trying to answer them.",
    coach: "Help the reader sort their questions into kinds: definition, reason, background, connection, implication. Point to the puzzles the passage's own wording creates, without answering them.",
    avoid: "Answering too quickly; letting early guesses harden into conclusions.",
    done: "Several questions are logged, sorted by kind, and the strongest ones are marked to carry into Interpretation.",
    needsNotes: true
  },

  // ------------------------------------------------------------ Interpretation
  "int-genre": {
    phase: "interpretation",
    title: "Identify genre & its rules",
    goal: "Name the genre and the reading habits it demands.",
    coach: "Use the supplied genre guide. Ask what the passage is DOING (arguing, narrating, singing, warning, commanding, picturing) and which wording clues show it. Note if the passage blends forms.",
    avoid: "Reading by the wrong rules: a parable like prophecy, poetry flattened into prose, an epistle as a story.",
    done: "Genre is named with at least one textual clue and one reading rule it implies.",
    needsNotes: true
  },
  "int-setting": {
    phase: "interpretation",
    title: "Historical & cultural setting",
    goal: "Learn who wrote, to whom, when, and why, and what pressures shaped it.",
    coach: "Ask for author, audience, date, occasion and pastoral purpose, as far as the evidence allows. Point to pressures visible inside the book (poverty, wealth, trials, favouritism, conflict, exile, persecution). Suggest where to look: the book's own opening and closing, then a study Bible introduction.",
    avoid: "Treating the first audience as identical to a later theological controversy.",
    done: "Author, audience and occasion are stated, plus what change the author wanted to produce.",
    needsNotes: true
  },
  "int-context": {
    phase: "interpretation",
    title: "Literary context",
    goal: "See how the verse functions in its sentence, paragraph, book and the wider story.",
    coach: "Walk the context ladder in order: thought unit, paragraph flow, the verse's function (claim, command, reason, warning, example, conclusion), then section, book, same author, canon, redemptive-historical. Ask the reader to write one sentence of local meaning before moving wider.",
    avoid: "Jumping to cross-references, theology or application before the local paragraph has spoken; a local meaning so broad it could fit any verse.",
    done: "A one-sentence local-context meaning is written, naming the author, main idea and paragraph frame.",
    needsNotes: true
  },
  "int-keywords": {
    phase: "interpretation",
    title: "Study the key words",
    goal: "Test the local meaning by studying the words that carry the argument.",
    coach: "Help the reader choose only words that are repeated, theologically weighty or central to the logic. Point to which words in this passage qualify. Remind them to find the original-language word with a responsible tool, see its range, compare same-author usage, and let context choose the sense.",
    avoid: "Root fallacy, illegitimate totality transfer, time-frame fallacy, English-only fallacy, context bypass, same-word-same-meaning, theological overload.",
    done: "One to three key words are studied, and for each the reader names which sense fits here and why.",
    needsNotes: true
  },
  "int-scripture": {
    phase: "interpretation",
    title: "Let Scripture interpret Scripture",
    goal: "Compare clear passages on the same topic, after the nearby work is done.",
    coach: "Start near: same paragraph, book, author, then the cross-references the passage itself gives (quotations and allusions). Point out which quoted or alluded passages this one depends on. Only then clear passages on the same topic, comparing arguments rather than shared English words.",
    avoid: "Chasing shared English words; letting a distant passage take over the local meaning.",
    done: "At least one cross-reference is traced and the reader says what it clarifies while the local paragraph still controls.",
    needsNotes: true
  },
  "int-theology": {
    phase: "interpretation",
    title: "Test with theology & redemptive history",
    goal: "Ask what the passage contributes to the Bible's teaching, without a system swallowing the paragraph.",
    coach: "Help the reader name the main theological subject (God, humanity, sin, covenant, Christ, Spirit, church, mission, judgment, restoration) and locate the passage in creation, fall, redemption, restoration. Ask how it relates to the Great Controversy theme without flattening the genre.",
    avoid: "Turning every detail into a hidden symbol; stating theology as a replacement for the author's meaning.",
    done: "A theological contribution is stated as growing out of the local meaning.",
    needsNotes: true
  },
  "int-resources": {
    phase: "interpretation",
    title: "Consult trusted resources last",
    goal: "Check the reader's own interpretation against trusted resources.",
    coach: "Confirm the reader has already written their own interpretation. Then suggest the order: Ellen White where she comments on the passage or principle, Adventist study helps (SDA Bible Commentary, study Bible notes), then broader conservative commentaries. Ask of each: does it confirm, correct or sharpen my reading?",
    avoid: "Borrowing a conclusion before understanding the evidence; quoting a commentary as a shortcut.",
    done: "The reader names what a resource confirmed, corrected or sharpened.",
    needsNotes: true
  },
  "int-statement": {
    phase: "interpretation",
    title: "Write a clear interpretation statement",
    goal: "State what the author meant in one clear, contextual sentence.",
    coach: "Give the template: 'In [passage], [author] teaches [main meaning] by [textual evidence], so that [intended force].' Check their draft against genre, setting, context, key words, cross-references and theology. Look for the misuse the statement could invite and tell them which direction to refine (not the wording itself).",
    avoid: "A statement that explains only one phrase; one that could be heard as the opposite error.",
    done: "The statement names the problem, the author's main point, and the key clarification, and accounts for the whole passage.",
    needsNotes: true
  },

  // ------------------------------------------------------------ Imagination
  "img-picture": {
    phase: "imagination",
    title: "Picture the setting",
    goal: "Reconstruct the scene using only what the text and responsible background allow.",
    coach: "Point to the details the passage itself gives (place, people, sound, tone, tension) and ask the reader to build the scene from those alone.",
    avoid: "Adding details Scripture never gave; inventing facts to make the story easier.",
    done: "The reader describes the scene and every detail is traceable to the text or the background study.",
    needsNotes: true
  },
  "img-force": {
    phase: "imagination",
    title: "Feel its force",
    goal: "Enter what the first hearers would have felt: what would comfort, alarm, expose or convict them.",
    coach: "Ask what in this passage would have landed hardest on its first audience, given the setting found in Interpretation. Suggest linking to a time the reader has felt something similar, as an entry point only.",
    avoid: "Using imagination to create a new meaning rather than feel the one Scripture gives.",
    done: "The reader names the force and ties it to specific wording in the passage.",
    needsNotes: true
  },
  "img-distance": {
    phase: "imagination",
    title: "Measure the distance",
    goal: "Name what separates their world from ours, and what remains the same.",
    coach: "Prompt for differences in culture, covenant, language, setting and situation, and for what is shared. Point to which differences matter for this passage.",
    avoid: "Applying woodenly because the gap was ignored, or dismissing the passage because the gap was exaggerated.",
    done: "At least one difference and one point of continuity are written.",
    needsNotes: true
  },

  // ------------------------------------------------------------ Application
  "app-first": {
    phase: "application",
    title: "Meaning for the first hearers",
    goal: "State in one past-tense sentence what the passage meant for its first hearers.",
    coach: "Remind the reader to use their interpretation statement and write about THEM, in the form 'The author was telling these readers ...'. Resist jumping to the reader's own life.",
    avoid: "Skipping to modern application before the original meaning is clear.",
    done: "One sentence about the first audience, in the past tense, taken from the interpretation statement.",
    needsNotes: true
  },
  "app-principle": {
    phase: "application",
    title: "Timeless principle",
    goal: "Lift the enduring truth beneath the original situation.",
    coach: "Help the reader separate the setting from the principle. A good principle is drawn from the text, timeless, consistent with the rest of Scripture and true for both audiences. Check whether the principle is too literal (trapped in the setting) or too broad (could mean anything). If the passage is narrative, ask whether the example is merely recorded or is taught elsewhere.",
    avoid: "A principle so literal it stays ancient, or so broad it floats free of the text.",
    done: "A one-sentence principle passes the four tests and the reader says how.",
    needsNotes: true
  },
  "app-home": {
    phase: "application",
    title: "Bring it home",
    goal: "Search where this truth touches life and move through the circles of application.",
    coach: "Offer S.P.A.C.E.P.E.T.S. as a search grid (Sin, Promise, Attitude, Command, Example, Prayer, Error, Truth, Something to praise) and point to which of these this passage is most likely to yield. Then the circles: personal, family, church, nation, world, Great Controversy, noting not every passage reaches every circle.",
    avoid: "Warm resolutions that sound spiritual but cannot be obeyed; applying in a way that ignores what it meant in context.",
    done: "At least two items from the grid are filled from the text, and the reader says which circle presses first.",
    needsNotes: true
  },
  "app-step": {
    phase: "application",
    title: "One concrete step",
    goal: "Turn meaning into one checkable act of obedience.",
    coach: "Use the form 'This week, because this passage shows me ___, I will ___.' Test it: is it specific, personal, measurable, time-bound, and does it grow directly from the interpretation sentence?",
    avoid: "'Be more loving' vagueness; an action that cannot be checked or remembered; self-salvation or self-excuse.",
    done: "A single specific action with a time frame that follows from the interpretation statement.",
    needsNotes: true
  }
};

export const STEP_IDS = Object.keys(STEPS);
