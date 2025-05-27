#!/usr/bin/env node
import fs from 'fs';
const msg = process.argv.slice(2).join(' ') || 'No message';
const stamp = new Date().toISOString().replace('T', ' ').substring(0,16);
fs.appendFileSync('docs/PROGRESS.md', `- ${stamp} | ${msg}\n`);
console.log('📝  Progress logged:', msg); 