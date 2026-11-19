// gta6-meme-x-01 — "Post a GTA 6 meme on X".
// Copies POST.json (the address of the X post carrying the meme) from the
// repository root to the output directory. Node 22, standard library only,
// no network. All paths resolve relative to this script file, never the
// working directory; the output directory comes from MAKEFUN_OUTPUT_DIR,
// falling back to /output.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

const postPath = join(repoRoot, "POST.json");
if (!existsSync(postPath)) {
  console.error(`POST.json not found at ${postPath}`);
  process.exit(1);
}

// POST.json must be a JSON object naming the post with an https URL;
// refuse to copy a malformed file so a bad entry fails loudly here.
let post;
try {
  post = JSON.parse(readFileSync(postPath, "utf8"));
} catch {
  console.error("POST.json is not valid JSON");
  process.exit(1);
}
if (typeof post?.url !== "string" || !post.url.startsWith("https://")) {
  console.error("POST.json must contain a string url starting with https://");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(postPath, join(outDir, "POST.json"));
console.log(`POST.json -> ${join(outDir, "POST.json")}`);
