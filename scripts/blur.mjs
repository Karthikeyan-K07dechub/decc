#!/usr/bin/env node
/**
 * Generates lib/blur.json: a tiny blurred preview for every image in lib/images.ts.
 * Fetches a 24px-wide version of each Unsplash photo, so it needs internet.
 * Runs before `npm run build` (soft: never fails the build if offline).
 *   npm run blur
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = await readFile(join(root, "lib", "images.ts"), "utf8");
const soft = process.argv.includes("--soft");

// Read id + url pairs straight from the source so lib/images.ts stays the only place URLs live.
const entries = [...src.matchAll(/(\w+): \{\s*id: "\w+",\s*url: u\("([^"]+)"\)|(\w+): \{\s*id: "\w+",\s*url: "([^"]+)"/g)].map((m) =>
  m[1] ? [m[1], `https://images.unsplash.com/${m[2]}`] : [m[3], m[4]]
);

const out = {};
let failed = 0;
for (const [id, url] of entries) {
  if (url.startsWith("/")) continue; // local files: next/image creates their blur automatically
  try {
    const res = await fetch(`${url}${url.includes("?") ? "&" : "?"}w=24&q=40&fm=jpg&blur=40`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    out[id] = `data:image/jpeg;base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
    console.log(`✓ ${id}`);
  } catch (e) {
    failed++;
    console.warn(`✗ ${id}: ${e.message}`);
  }
}
if (Object.keys(out).length) await writeFile(join(root, "lib", "blur.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`${Object.keys(out).length} blur placeholders, ${failed} failed${failed ? " (flat tones used instead)" : ""}.`);
process.exit(failed && !soft ? 1 : 0);
