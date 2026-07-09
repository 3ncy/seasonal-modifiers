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

for (const modifier of data.seasons[0].global) {
    const generatedItem =
        `<modifier-item disabled>
            <modifier-name>${modifier.name}</modifier-name>
            <modifier-description>${modifier.description}</modifier-description>
        </modifier-item>\n`;
    sw.global.write(generatedItem);
}

for (const modifier of data.seasons[0].personalPositive) {
    sw.positive.write(
        `<modifier-item>
            <modifier-name>${modifier.name}</modifier-name>
            <modifier-points>${modifier.points}</modifier-points>
            <modifier-description>${modifier.description}</modifier-description>
        </modifier-item>\n`)
}

for (const modifier of data.seasons[0].personalNegative) {
    sw.negative.write(
        `<modifier-item>
            <modifier-name>${modifier.name}</modifier-name>
            <modifier-points>${modifier.points}</modifier-points>
            <modifier-description>${modifier.description}</modifier-description>
        </modifier-item>\n`)
}

closeWriters(sw);
