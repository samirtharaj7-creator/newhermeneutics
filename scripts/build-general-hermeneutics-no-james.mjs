import { readFile, writeFile } from "node:fs/promises";

const sourcePath = new URL("../general-hermeneutics-complete-text.md", import.meta.url);
const outputPath = new URL("../general-hermeneutics-no-james-2.md", import.meta.url);
const plainTextOutputPath = new URL("../general-hermeneutics-no-james-2.txt", import.meta.url);
const infographicSourcePath = new URL("../hermeneutics-infographic-text.md", import.meta.url);
const infographicOutputPath = new URL(
  "../general-hermeneutics-infographic-ready-text.md",
  import.meta.url,
);

const lines = (await readFile(sourcePath, "utf8")).split("\n");

const dropRanges = [
  [115, 115],
  [171, 173],
  [216, 218],
  [237, 239],
  [258, 268],
  [286, 288],
  [309, 313],
  [325, 325],
  [338, 338],
  [353, 353],
  [359, 359],
  [365, 365],
  [371, 371],
  [382, 382],
  [394, 394],
  [404, 404],
  [426, 432],
  [454, 462],
  [525, 527],
  [568, 570],
  [681, 687],
  [702, 704],
  [719, 721],
  [736, 738],
  [753, 755],
  [780, 780],
  [787, 787],
  [794, 794],
  [801, 801],
  [808, 808],
  [859, 861],
  [881, 903],
  [934, 960],
  [990, 992],
  [1022, 1024],
  [1054, 1056],
  [1120, 1122],
  [1179, 1179],
  [1187, 1187],
  [1195, 1195],
  [1212, 1214],
  [1243, 1245],
  [1275, 1277],
  [1290, 1290],
  [1303, 1303],
  [1325, 1328],
];

const replacements = new Map([
  [1, "# General Hermeneutics Complete Text - Infographic Source Edition"],
  [3, "Prepared from the rendered app text. Worked passage examples have been omitted."],
  [411, "Who appears, speaks, acts, receives action, or remains silent?"],
  [413, "What happens, is commanded, promised, questioned, repeated, or emphasized?"],
  [415, "When does this occur, and what sequence or time markers appear?"],
  [417, "Where does the action or argument take place, and does movement matter?"],
  [419, "Why is this said or done, and what reasons does the text supply?"],
  [421, "How does the passage develop its action, logic, contrast, or conclusion?"],
  [512, "Genre tells you how a passage communicates. A passage may be a letter, narrative, poetry, law, parable, prophecy, wisdom, gospel, or apocalyptic vision; each form uses its own conventions and communicative strategies."],
  [516, "If you misread the genre, you will usually misread the passage. A parable should not be handled like prophecy, poetry should not be flattened into prose, and an epistle should not be read as if it were a narrative scene."],
  [522, "Check the book-level setting so the passage is read according to the literary form and purpose of the whole book."],
  [551, "Do not flatten the passage into a detached theological dictionary entry. Let its literary and exhortational force remain."],
  [557, "Historical setting asks who first received the words, what they were facing, and why the author needed to speak this way. This is also where authorial purpose belongs: what is the author trying to accomplish with this audience?"],
  [561, "The Bible speaks to us, but it did not first speak to us. Historical setting helps us hear why these words mattered to the original readers before we carry them into our own questions."],
  [655, "Who first received this passage, what were they facing, and why does the author press this point?"],
  [659, "Audience, occasion, social pressure, repeated concerns in the book, and the pastoral change the author wants to produce."],
  [663, "Do not make the first audience identical to a later theological controversy. The author has a particular historical and pastoral occasion."],
  [708, "Treating a verse as if it were a standalone slogan detached from its paragraph."],
  [725, "Jumping to other passages, theology, or application before the author's own paragraph has spoken."],
  [822, "Author First"],
  [824, "Have I let this author speak before importing outside debates?"],
  [907, "Which words carry the argument, and how does the author use them here?"],
  [911, "Repeated phrases, semantic range, grammatical function, same-author usage, and words that carry literary or theological weight."],
  [915, "Do not import another author's use of a word as though both writers must be making the identical argument. The same word can function differently in a different setting."],
  [929, "Follow the cross-references the passage itself gives you before moving to distant topical verses."],
  [931, "Then compare clear passages on the same topic, but compare the argument, not merely shared English words."],
  [933, "Return to the local paragraph. Cross-references should deepen the author's point, not replace it."],
  [972, "Do not chase shared English words or use a distant passage to silence the local author. Cross-references are checks and clarifiers, not shortcuts around the passage in front of you."],
  [1032, "Careful handling of the passage, relevant cross-references, historical background, and theological questions without flattening one author into another."],
  [1064, "Application may take many faithful forms, but the meaning must be governed by what the author meant in this passage."],
  [1072, "The problem addressed, the author's main point, the decisive textual evidence, and a sentence that accounts for the whole passage."],
  [1076, "If the statement ignores the passage's context, genre, or decisive details, refine it until it accounts for the whole text."],
  [1209, "Put it in past-tense, audience-specific language: \"The author was telling these readers...\""],
  [1240, "Separate the setting from the principle. Identify the concrete original situation, then name the enduring truth that travels from their world to ours."],
  [1267, "A principle admired but not obeyed changes nothing. Biblical application should be concrete: not a vague intention, but a real act of faithfulness in a real situation."],
  [1307, "In [passage], [author] teaches [the passage's central meaning]."],
  [1311, "This week, because [this truth is true], I will [one specific, checkable action]."],
]);

const shouldDrop = (lineNumber) =>
  dropRanges.some(([start, end]) => lineNumber >= start && lineNumber <= end);

const output = lines
  .map((line, index) => {
    const lineNumber = index + 1;
    if (shouldDrop(lineNumber)) return null;
    return replacements.get(lineNumber) ?? line;
  })
  .filter((line) => line !== null)
  .join("\n")
  .replace(
    /OVERVIEW\nPREPARATION\nOBSERVATION\nINTERPRETATION\nIMAGINATION\nAPPLICATION\n/g,
    "",
  )
  .replace(/^Source route:.*\n\n/gm, "")
  .replace(/^```text\n/gm, "")
  .replace(/^```\n/gm, "")
  .replace(/\n{3,}/g, "\n\n")
  .trimEnd()
  .concat("\n");

await writeFile(outputPath, output, "utf8");

const plainTextOutput = output
  .replace(/^#{1,6}\s+/gm, "")
  .replace(/^-\s+/gm, "")
  .trimEnd()
  .concat("\n");

await writeFile(plainTextOutputPath, plainTextOutput, "utf8");

const infographicSource = await readFile(infographicSourcePath, "utf8");
const generalStart = infographicSource.indexOf("## General Hermeneutics");
const specialStart = infographicSource.indexOf("## Special Hermeneutics");

if (generalStart === -1 || specialStart === -1 || specialStart <= generalStart) {
  throw new Error("Could not locate the General Hermeneutics infographic section.");
}

const infographicOutput = [
  "# General Hermeneutics Infographic-Ready Text",
  "",
  "A concise source packet for one overview infographic and five focused phase infographics.",
  "",
  infographicSource.slice(generalStart, specialStart).trim(),
  "",
].join("\n");

await writeFile(infographicOutputPath, infographicOutput, "utf8");
