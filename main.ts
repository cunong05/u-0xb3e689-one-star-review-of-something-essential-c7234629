// One-Star Review of Something Essential — make.fun bounty
// Writes exactly one line to /output/entry.txt: a deadpan one-star
// review of the sun, the everyday essential nobody can opt out of.
//
// The entry: the sun shows up on time every morning, works all day
// for free, and still burns you on your one day off. One line,
// 116 characters, no trailing newline.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "The sun shows up every morning without fail, works all day for free, and still manages to burn me on my one day off.";

// SHA-256 of the entry, byte for byte. The gate below refuses to write
// anything whose hash differs, so a typo or an accidental edit to the
// entry can never silently ship a different line.
const ENTRY_SHA256 =
  "71e8b426b6b08cdb6938d705ecd681d6372b4b2d0a6a54a597b9a6ed544c1f93";

function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

// Validation: the entry must be exactly one line of at most
// 160 characters — anything else (empty, too long, multi-line)
// is a wrong entry, so fail loudly instead of writing it.
if (ENTRY.length === 0 || ENTRY.length > 160 || ENTRY.includes("\n")) {
  throw new Error(
    `Invalid entry: expected one line of 1-160 characters, got ${ENTRY.length} characters`,
  );
}
if (sha256(ENTRY) !== ENTRY_SHA256) {
  throw new Error(
    "Invalid entry: entry hash does not match the pinned SHA-256",
  );
}

const outputDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), ENTRY, "utf8");

// Re-check what was actually written: entry.txt must be exactly
// the entry, one line, no trailing newline, with the pinned hash.
const written = readFileSync(join(outputDir, "entry.txt"), "utf8");
if (written !== ENTRY) {
  throw new Error(
    `Invalid entry file: expected ${JSON.stringify(ENTRY)}, got ${JSON.stringify(written)}`,
  );
}
if (sha256(written) !== ENTRY_SHA256) {
  throw new Error(
    "Invalid entry file: written entry hash does not match the pinned SHA-256",
  );
}
