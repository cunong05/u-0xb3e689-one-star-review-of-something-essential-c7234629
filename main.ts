// One-Star Review of Something Essential — make.fun bounty
// Writes exactly one line to /output/entry.txt: a deadpan one-star
// review of the sun, the everyday essential nobody can opt out of.
//
// The entry: the sun shows up on time every morning, works all day
// for free, and still burns you on your one day off. One line,
// 116 characters, no trailing newline.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "The sun shows up every morning without fail, works all day for free, and still manages to burn me on my one day off.";

// Validation: the entry must be exactly one line of at most
// 160 characters — anything else (empty, too long, multi-line)
// is a wrong entry, so fail loudly instead of writing it.
if (ENTRY.length === 0 || ENTRY.length > 160 || ENTRY.includes("\n")) {
  throw new Error(
    `Invalid entry: expected one line of 1-160 characters, got ${ENTRY.length} characters`,
  );
}

const outputDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), ENTRY, "utf8");

// Re-check what was actually written: entry.txt must be exactly
// the entry, one line, no trailing newline.
const written = readFileSync(join(outputDir, "entry.txt"), "utf8");
if (written !== ENTRY) {
  throw new Error(
    `Invalid entry file: expected ${JSON.stringify(ENTRY)}, got ${JSON.stringify(written)}`,
  );
}
