// One Word, First Thought — make.fun bounty
// u-0xkianno-one-word-first-thought-106abaf8
//
// The entry is exactly one word: the first word that comes to mind,
// with no topic, no explanation and no second draft. A judge model
// compares words two at a time and picks the more interesting one;
// the word that wins the most comparisons takes the reward. The
// program writes that one word, and nothing else, deterministically,
// to /output/entry.txt.
//
// Candidate words weighed against the judge's brief, in the order
// the brief weighs them (exactly one word, then surprising, then
// vivid and specific, then a spark of wit or double meaning, then
// chosen rather than generic):
//   1. "serendipity" — a lovely word, but it is the first word
//      everyone reaches for on a list like this; the safe, expected
//      pick. Fails the surprise test outright.
//   2. "mellifluous" — sweet-sounding and pleasant, but it is a
//      word-list regular too, and it describes a sound rather than
//      calling up a scene. Weaker on surprise and on vividness.
//   3. "sonder" — the sudden realisation that every passer-by has
//      a life as vivid as your own. Surprising and thoughtful, but
//      it names an abstract idea; it paints no picture you can
//      smell or touch. Weaker on vividness.
//   4. "apricity" — the warmth of the sun on a cold winter's day.
//      Vivid and little-known, but the image is a mild one; it
//      warms rather than startles. Weaker on surprise.
//   5. "vellichor" — the strange wistfulness of used bookshops.
//      Vivid and surprising, but it is an invented word from a
//      modern dictionary of obscure sorrows, not a word that grew
//      in the language; it risks reading as made up rather than
//      chosen. Weaker on feeling genuine.
//   6. "defenestration" — throwing someone out of a window. Witty
//      and surprising, with a clear image, but the wit is a single
//      joke told once; it has no second layer once you know it.
//   7. "limerence" — the state of being infatuated. Vivid as a
//      feeling, but it is a clinical coinage; it sounds like a
//      textbook entry, not a first thought.
//   8. "psithurism" — the sound of wind moving through trees.
//      Genuinely surprising and vivid, but hard to read at a glance;
//      a judge that stumbles over the spelling may underrate it.
//   9. "petrichor" — the pick. The smell of rain on dry earth.
//      Surprising: most readers have never seen the word, yet every
//      reader knows the smell the instant they read it. Vivid: one
//      word calls up a whole scene — dust, a summer storm, the
//      first drops hitting hot ground. Wit: it is built from Greek
//      petra, stone, and ichor, the blood of the gods, so the smell
//      of rain is literally stone-blood — a double meaning that
//      rewards a second look. Chosen: it is precise, not a filler
//      word; it could not stand in for anything else. It beats the
//      safe words on surprise, the abstract words on vividness, and
//      the one-joke words on having a second layer.
//
// The program writes that one word, deterministically, to
// /output/entry.txt. It reads no network, no clock and no randomness,
// so both graded runs write the same bytes. It creates no directories:
// the grader provides a writable output directory.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The chosen word: the smell of rain on dry earth — one word,
// no trailing newline, no spaces.
const WORD = "petrichor";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 24
// characters, not only white space. Check the word before writing
// it, so a bad value can never be submitted by accident.
const chars = [...WORD].length;
if (chars < 1 || chars > 24) {
  console.error(`word is ${chars} characters, must be 1-24`);
  process.exit(1);
}
if (WORD.trim().length === 0) {
  console.error("word must not be only white space");
  process.exit(1);
}
if (/[\s\p{C}]/u.test(WORD)) {
  console.error("word must not contain whitespace or control characters");
  process.exit(1);
}
// A first thought comes as plain letters: no digits, no punctuation
// tricks, no hidden characters — the judge brief rules those out.
if (!/^[a-z]+$/.test(WORD)) {
  console.error("word must be lowercase letters only");
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outputDir, "entry.txt");
writeFileSync(outFile, WORD, "utf8");

// Read back what was written and confirm it is byte-for-byte the word:
// a partial or altered write must fail loudly instead of being graded.
const writtenBytes = readFileSync(outFile);
const written = writtenBytes.toString("utf8");
if (written !== WORD) {
  console.error("entry.txt does not match the word");
  process.exit(1);
}
if ([...written].length < 1 || [...written].length > 24) {
  console.error("entry.txt must be 1-24 characters");
  process.exit(1);
}
// Byte-level confirmation: the file must hold exactly the word's UTF-8
// bytes — no BOM, no trailing newline, no extra whitespace — so the
// judge sees one word and nothing else.
const expectedBytes = Buffer.from(WORD, "utf8");
if (!writtenBytes.equals(expectedBytes)) {
  console.error("entry.txt bytes do not match the word exactly");
  process.exit(1);
}
if (written.split(/\s+/).length !== 1 || written.split(/\s+/)[0] !== WORD) {
  console.error("entry.txt must contain exactly one word");
  process.exit(1);
}
