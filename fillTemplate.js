import * as fs from 'fs';

let index = fs.readFileSync('./index.html', 'utf8');

const global = fs.readFileSync('./global.html', 'utf8');
const positive = fs.readFileSync('./positive.html', 'utf8');
const negative = fs.readFileSync('./negative.html', 'utf8');

index = index.replace(/<!-- global template start -->[\s\S]*<!-- global template end -->/gm, global);
index = index.replace(/<!-- positive template start -->[\s\S]*<!-- positive template end -->/gm, positive);
index = index.replace(/<!-- negative template start -->[\s\S]*<!-- negative template end -->/gm, negative);

fs.writeFileSync('./index.html', index, 'utf8');