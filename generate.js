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

sw.global.write(`<!-- global template start -->`);
for (const modifier of data.seasons[0].global) {
    const generatedItem = `
        <modifier-item disabled checked>
            <modifier-name>${modifier.name}</modifier-name>
            <modifier-description>${modifier.description}</modifier-description>
        </modifier-item>`;
    sw.global.write(generatedItem);
}
sw.global.write(`\n       <!-- global template end -->`);

sw.positive.write(`<!-- positive template start -->`);
for (const modifier of data.seasons[0].personalPositive) {
    const hasGroup = modifier.hasOwnProperty('group');
    sw.positive.write(`
        <modifier-item${hasGroup ? ' group="' + modifier.group + '"' : ''}>
            <modifier-name>${modifier.name}</modifier-name>
            <modifier-points>${modifier.points}</modifier-points>
            <modifier-description>${modifier.description}</modifier-description>
        </modifier-item>`)
}
sw.positive.write(`\n       <!-- positive template end -->`);

sw.negative.write(`<!-- negative template start -->`);
for (const modifier of data.seasons[0].personalNegative) {
    const hasGroup = modifier.hasOwnProperty('group');
    sw.negative.write(`
        <modifier-item${hasGroup ? ' group="' + modifier.group + '"' : ''}>
            <modifier-name>${modifier.name}</modifier-name>
            <modifier-points>${modifier.points.toString()[0] == '+' ? modifier.points : '+' + modifier.points}</modifier-points>
            <modifier-description>${modifier.description}</modifier-description>
        </modifier-item>`)
}
sw.negative.write(`\n       <!-- negative template end -->`);

closeWriters(sw);
