import * as fs from 'fs';

const data = JSON.parse(fs.readFileSync('./data/kordBreachModifiers.json', 'utf8'));

const sw = initWriters(['global', 'positive', 'negative']);

function initWriters(outputFiles) {
    let writers = {};
    for (const file of outputFiles) {
        const filename = file + '.html';
        writers[file] = fs.createWriteStream(filename, { flags: 'a' });
        if (fs.existsSync(filename)) fs.rmSync(filename);
    }
    return writers;
}
function closeWriters(writers) {
    for (const file in writers) { writers[file].end(); }
}
function br(text) {
    return text.replace(/\n/g, '<br>');
}

sw.global.write(`<!-- global template start -->`);
for (const modifier of data.seasons[0].global) {
    const generatedItem = `
        <modifier-item disabled checked>
            <modifier-name>${modifier.name}</modifier-name>
            <modifier-description>${br(modifier.description)}</modifier-description>
        </modifier-item>`;
    sw.global.write(generatedItem);
}
sw.global.write(`\n       <!-- global template end -->`);

sw.positive.write(`<!-- positive template start -->`);
for (const modifier of data.seasons[0].personalPositive) {
    const isBlocking = modifier.hasOwnProperty('blocks');
    sw.positive.write(`
        <modifier-item modifier-id="${modifier.id}"${isBlocking ? ' blocking' : ''}>
            <modifier-name>${modifier.name}</modifier-name>
            <modifier-points>${modifier.points}</modifier-points>
            <modifier-description>${br(modifier.description)}</modifier-description>${isBlocking ? `
            <modifier-blocking>${JSON.stringify(modifier.blocks)}</modifier-blocking>` : ''
        }
        </modifier-item>`)
}
sw.positive.write(`\n       <!-- positive template end -->`);

sw.negative.write(`<!-- negative template start -->`);
for (const modifier of data.seasons[0].personalNegative) {
    const isBlocking = modifier.hasOwnProperty('blocks');
    sw.negative.write(`
        <modifier-item modifier-id="${modifier.id}"${isBlocking ? ' blocking' : ''}>
            <modifier-name>${modifier.name}</modifier-name>
            <modifier-points>${modifier.points.toString()[0] == '+' ? modifier.points : '+' + modifier.points}</modifier-points>
            <modifier-description>${br(modifier.description)}</modifier-description>${isBlocking ? `
            <modifier-blocking>${JSON.stringify(modifier.blocks)}</modifier-blocking>` : ''
        }
        </modifier-item>`)
}
sw.negative.write(`\n       <!-- negative template end -->`);

closeWriters(sw);
