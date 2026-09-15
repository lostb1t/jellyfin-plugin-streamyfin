// Reads what Jellyfin publishes and what this repository builds against, and prints the
// difference as JSON on stdout. nuget-watch.yml turns that into an issue, once.

const fs = require('fs');
const { classify, builtVersionsFrom } = require('./jellyfin-versions');

const FEED = 'https://api.nuget.org/v3-flatcontainer/jellyfin.controller/index.json';

async function main() {
    const built = builtVersionsFrom(fs.readFileSync('Directory.Build.props', 'utf8'));

    const response = await fetch(process.env.NUGET_FEED || FEED);
    if (!response.ok) {
        throw new Error(`${FEED} answered ${response.status}`);
    }

    const { versions } = await response.json();
    const result = classify(versions, built);

    process.stdout.write(JSON.stringify({ ...result, built }) + '\n');
}

main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
});
