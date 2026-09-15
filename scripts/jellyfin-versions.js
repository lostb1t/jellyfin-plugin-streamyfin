// Comparing what Jellyfin publishes against what this repository builds against.
//
// The first version of this lived in nuget-watch.yml as `cut -d. -f1 | sort -u`, which
// compares major numbers and nothing else. It works for the case it was written for, a
// whole new Jellyfin line appearing, and is blind to every other one: 12.1.0 was
// published on 2026-09-15 and the watch said nothing, because 12 was already known.
// Prereleases are the case that matters most here, since the first 13.0.0-rc is the
// moment a 13 target becomes possible at all.

// NuGet versions are semantic enough for this: numeric parts, then an optional
// prerelease suffix after a hyphen. Build metadata after a plus is not used by Jellyfin
// and is ignored.
// Shape checked before the numbers are read, the same reason next-version.js does it:
// Number('') is 0, so '', '1..2' and '-1.0' all parse as a valid version otherwise, and
// a feed entry nobody can install would be reported as one that outranks the build.
const CORE = /^\d+(?:\.\d+){0,3}$/;

function parse(version) {
    if (typeof version !== 'string') return null;

    const [core, prerelease = ''] = version.split('+')[0].split(/-(.+)/);
    if (!CORE.test(core)) return null;

    const numbers = core.split('.').map(Number);
    while (numbers.length < 4) numbers.push(0);

    return { numbers: numbers.slice(0, 4), prerelease, raw: version };
}

function compare(a, b) {
    for (let i = 0; i < 4; i++) {
        if (a.numbers[i] !== b.numbers[i]) return a.numbers[i] - b.numbers[i];
    }

    // A prerelease is below the release it leads to: 12.0.0-rc7 is not 12.0.0. Two
    // prereleases of the same version are ordered by their suffix, which is enough to
    // keep the list stable without implementing the whole precedence rule.
    if (!a.prerelease && !b.prerelease) return 0;
    if (!a.prerelease) return 1;
    if (!b.prerelease) return -1;
    return a.prerelease < b.prerelease ? -1 : a.prerelease > b.prerelease ? 1 : 0;
}

/**
 * Split what is published into what this repository already covers and what it does not.
 *
 * @param {string[]} published Every version of the package on the feed.
 * @param {string[]} built The JellyfinVersion values Directory.Build.props declares.
 * @returns {{newLines: string[], newerInLine: string[], newest: string}}
 */
function classify(published, built) {
    const builtVersions = built.map(parse).filter(Boolean);
    if (builtVersions.length === 0) {
        throw new Error('No Jellyfin version found in Directory.Build.props.');
    }

    const newest = builtVersions.reduce((a, b) => (compare(a, b) >= 0 ? a : b));
    const builtMajors = new Set(builtVersions.map((v) => v.numbers[0]));

    const ahead = published
        .map(parse)
        .filter(Boolean)
        .filter((v) => compare(v, newest) > 0)
        .sort(compare);

    return {
        // A line nobody here builds against. This is the one that needs a new target,
        // and the procedure for it is in Compat/README.md.
        newLines: ahead.filter((v) => !builtMajors.has(v.numbers[0])).map((v) => v.raw),

        // A newer version of a line already built. Usually nothing to do, since the
        // reference is a floor and a newer server satisfies it, but it is the moment to
        // check the host's EF Core pin and whether anything the plugin uses moved.
        newerInLine: ahead.filter((v) => builtMajors.has(v.numbers[0])).map((v) => v.raw),

        newest: newest.raw,
    };
}

// The property is repeated once per target, so every value is read rather than the first.
function builtVersionsFrom(props) {
    return [...props.matchAll(/<JellyfinVersion>([^<]+)<\/JellyfinVersion>/g)].map((m) => m[1].trim());
}

module.exports = { parse, compare, classify, builtVersionsFrom };
