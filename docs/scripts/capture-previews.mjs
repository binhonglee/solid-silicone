#!/usr/bin/env node
/**
 * Capture link-preview screenshots of the built docs with
 * `@globetrotte/altimeter` into `docs/dist/preview/`.
 *
 * Runs after `vite build`: serves `docs/dist` on a loopback port, points
 * altimeter at it, and writes `og.jpg` (1200x630) next to the deployed
 * assets so the `og:image` meta tag resolves on Pages. All paths derive
 * from this file's location, so the working directory does not matter.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const docsDir = join(here, '..');
const distDir = join(docsDir, 'dist');
const outDir = join(distDir, 'preview');

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
};

/** Minimal static server for the built bundle (hash routes all serve `/`). */
function serve(root) {
    return new Promise((resolve) => {
        const server = createServer(async (req, res) => {
            try {
                const url = new URL(req.url ?? '/', 'http://localhost');
                let file = normalize(join(root, url.pathname));
                if (!file.startsWith(root)) {
                    res.writeHead(403);
                    res.end();
                    return;
                }
                if (existsSync(file) && statSync(file).isDirectory()) {
                    file = join(file, 'index.html');
                }
                if (!existsSync(file)) {
                    file = join(root, 'index.html');
                }
                const body = await readFile(file);
                res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
                res.end(body);
            } catch {
                res.writeHead(500);
                res.end();
            }
        });
        server.listen(0, '127.0.0.1', () => resolve(server));
    });
}

if (!existsSync(join(distDir, 'index.html'))) {
    console.error('capture-previews: docs/dist is missing; run `vite build` first.');
    process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const server = await serve(distDir);
const address = server.address();
if (address === null || typeof address === 'string') {
    console.error('capture-previews: could not bind a loopback port.');
    process.exit(1);
}
const configPath = join(tmpdir(), `silicone-altimeter-${address.port}.json`);
writeFileSync(
    configPath,
    JSON.stringify({
        baseURL: `http://127.0.0.1:${address.port}`,
        dir: `${outDir}/`,
        width: 1200,
        height: 630,
        destURLs: [{ name: 'og', url: '' }],
    }),
);

const binName = `altimeter${process.platform === 'win32' ? '.cmd' : ''}`;
const bin = join(docsDir, '..', 'node_modules', '.bin', binName);
const code = await new Promise((resolve, reject) => {
    const child = spawn(bin, [configPath], { stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', resolve);
});
server.close();
if (code !== 0) {
    console.error(`capture-previews: altimeter exited with code ${code}.`);
    process.exit(code ?? 1);
}
if (!existsSync(join(outDir, 'og.jpg'))) {
    console.error('capture-previews: altimeter finished without writing preview/og.jpg.');
    process.exit(1);
}
console.log('capture-previews: preview/og.jpg ready.');
