import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const configPath = resolve('.vercel/output/config.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

config.routes = [
  { src: '^/api(?:/.*)?$', dest: '/api' },
  { handle: 'filesystem' },
  { src: '/(.*)', dest: '/index.html' },
];

writeFileSync(configPath, JSON.stringify(config));

const vcConfigPath = resolve('.vercel/output/functions/api.func/.vc-config.json');
const vcConfig = JSON.parse(readFileSync(vcConfigPath, 'utf-8'));
vcConfig.maxDuration = 60;
writeFileSync(vcConfigPath, JSON.stringify(vcConfig));

// generationService reads prompts at runtime (bundled next to api.func/index.js)
const promptsSrc = resolve('server/prompts');
const promptsDest = resolve('.vercel/output/functions/api.func/prompts');

mkdirSync(promptsDest, { recursive: true });
cpSync(promptsSrc, promptsDest, { recursive: true });
