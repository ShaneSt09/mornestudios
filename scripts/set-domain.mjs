// Switch every absolute site URL (canonical tags, link previews, sitemap,
// robots.txt, the contact form's redirect) to a new address.
//
//   node scripts/set-domain.mjs https://mornestudio.dm
//
// The current address lives in site.config.json and is updated too.

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const configPath = join(root, "site.config.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));

const next = (process.argv[2] || "").trim().replace(/\/+$/, "");
if (!/^https:\/\/[^/\s]+(\/[^\s]*)?$/.test(next)) {
  console.error("Usage: node scripts/set-domain.mjs https://your-domain.com");
  process.exit(1);
}

const current = config.siteUrl;
if (current === next) {
  console.log(`Already set to ${next}`);
  process.exit(0);
}

const skip = new Set([".git", ".github", "node_modules", ".wrangler", "scripts"]);
const types = new Set([".html", ".xml", ".txt"]);
let changed = 0;

const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      walk(path);
    } else if (types.has(extname(name))) {
      const text = readFileSync(path, "utf8");
      if (text.includes(current)) {
        writeFileSync(path, text.split(current).join(next));
        console.log(`updated ${path.slice(root.length)}`);
        changed++;
      }
    }
  }
};

walk(root);
config.siteUrl = next;
writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
console.log(`\n${changed} file(s) switched from ${current} to ${next}`);
