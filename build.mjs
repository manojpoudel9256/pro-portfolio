#!/usr/bin/env node
/**
 * Builds the deployable site into dist/ — no dependencies, Node 18+.
 *
 *   node build.mjs           build dist/
 *   node build.mjs --check   build in memory and fail if any @include is broken
 *
 * src/index.html is the page template. A line containing only
 *   <!-- @include path -->   (markup)   or   /* @include path *\/   (inside <style>/<script>)
 * is replaced by the file src/path, re-indented to the marker's indentation, so
 * the output is still one fast page with its critical CSS and JS inlined.
 * "@include-raw" inserts a file verbatim (used where indentation must not change).
 * Everything else the site serves (assets/, fonts/, section CSS/JS, manifest, …)
 * is copied to dist/ unchanged; source-only files are skipped.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'dist');
const MARKER = /^([ \t]*)(?:<!--|\/\*)\s*@include(-raw)?\s+(\S+)\s*(?:-->|\*\/)\s*$/;

// Not part of the public site.
const SKIP = new Set(['src', 'dist', 'docs', 'tests', 'node_modules', '.git', '.github', '.vercel',
  'build.mjs', 'vercel.json', '.vercelignore', '.gitignore', '.gitattributes']);
const SKIP_PATHS = new Set(['assets/images/archive', 'assets/images/exports', 'assets/images/documentation',
  'assets/models/blender/audit_metadata.py']);

function expand(file, stack = []) {
  const rel = path.relative(SRC, file).replaceAll(path.sep, '/');
  if (stack.includes(rel)) throw new Error(`Circular @include: ${[...stack, rel].join(' → ')}`);
  if (!fs.existsSync(file)) throw new Error(`Missing @include: src/${rel}${stack.length ? ` (from src/${stack.at(-1)})` : ''}`);
  const out = [];
  for (const line of fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').split('\n')) {
    const m = line.match(MARKER);
    if (!m) { out.push(line); continue; }
    const [, indent, raw, target] = m;
    const body = expand(path.join(SRC, target), [...stack, rel]).replace(/\n$/, '').split('\n');
    out.push(...(raw ? body : body.map(l => (l ? indent + l : ''))));
  }
  return out.join('\n');
}

function copyStatic(dir = ROOT) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    const rel = path.relative(ROOT, abs).replaceAll(path.sep, '/');
    if (dir === ROOT && (SKIP.has(entry.name) || entry.name.endsWith('.md') || entry.name === 'index.html')) continue;
    if (SKIP_PATHS.has(rel) || entry.name.endsWith('.md')) continue;
    if (entry.isDirectory()) copyStatic(abs);
    else {
      fs.mkdirSync(path.dirname(path.join(OUT, rel)), { recursive: true });
      fs.copyFileSync(abs, path.join(OUT, rel));
    }
  }
}

const html = expand(path.join(SRC, 'index.html'));
if (/@include/.test(html.replace(/build\.mjs/g, ''))) {
  const line = html.split('\n').findIndex(l => /@include/.test(l)) + 1;
  throw new Error(`Unexpanded @include left in output (line ${line})`);
}
if (process.argv.includes('--check')) {
  console.log(`ok: src/index.html expands to ${html.split('\n').length} lines`);
} else {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'index.html'), html);
  copyStatic();
  console.log(`built dist/index.html (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB) + static files`);
}
