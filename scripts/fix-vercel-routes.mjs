import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const configPath = resolve('.vercel/output/config.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

config.routes = [
  { src: '^/api(?:/.*)?$', dest: '/api' },
  { handle: 'filesystem' },
  { src: '/(.*)', dest: '/index.html' },
];

writeFileSync(configPath, JSON.stringify(config));
