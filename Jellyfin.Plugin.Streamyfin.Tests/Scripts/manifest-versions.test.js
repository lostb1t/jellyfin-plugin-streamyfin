// What a manifest update does to the version list. The rest of
// validate-and-update-manifest.js is a network call or a file write; this is the part
// where a mistake is silent, since a dropped entry looks exactly like one that was never
// published.

import { describe, expect, test } from "bun:test";

const { place } = require("../../scripts/manifest-versions");

const entry = (version) => ({ version, sourceUrl: `https://example.invalid/${version}` });
const listOf = (...versions) => versions.map(entry);
const names = (versions) => versions.map((v) => v.version);

describe("placing a version in a manifest", () => {
    test("the new entry goes first, because that is the order the server merges on", () => {
        const { versions } = place(listOf("0.68.1.0", "0.68.0.0"), entry("0.69.0.0"), null);

        expect(names(versions)).toEqual(["0.69.0.0", "0.68.1.0", "0.68.0.0"]);
    });

    test("republishing a version replaces its entry rather than adding a second", () => {
        const { versions, replaced } = place(listOf("0.68.1.0", "0.68.0.0"), entry("0.68.1.0"), null);

        expect(replaced).toBe(1);
        expect(names(versions)).toEqual(["0.68.1.0", "0.68.0.0"]);
    });

    test("no limit keeps every version the manifest ever published", () => {
        const existing = listOf(...Array.from({ length: 40 }, (_, i) => `0.1.${i}.0`));

        const { versions, dropped } = place(existing, entry("0.2.0.0"), null);

        expect(dropped).toEqual([]);
        expect(versions).toHaveLength(41);
    });

    test("a limit keeps the newest and drops the tail", () => {
        const existing = listOf("0.68.1.5", "0.68.1.4", "0.68.1.3");

        const { versions, dropped } = place(existing, entry("0.68.1.6"), 3);

        expect(names(versions)).toEqual(["0.68.1.6", "0.68.1.5", "0.68.1.4"]);
        expect(names(dropped)).toEqual(["0.68.1.3"]);
    });

    // The off by one worth naming: a list already at the limit must not lose two.
    test("a list already at the limit loses exactly one", () => {
        const existing = listOf("c", "b", "a");

        const { versions, dropped } = place(existing, entry("d"), 3);

        expect(versions).toHaveLength(3);
        expect(dropped).toHaveLength(1);
    });

    test("a list under the limit loses nothing", () => {
        const { versions, dropped } = place(listOf("b", "a"), entry("c"), 10);

        expect(names(versions)).toEqual(["c", "b", "a"]);
        expect(dropped).toEqual([]);
    });

    // Republishing must not cost an extra slot. Filtering first and trimming afterwards
    // is what makes that hold.
    test("republishing under a limit keeps the same number of entries", () => {
        const existing = listOf("0.68.1.5", "0.68.1.4", "0.68.1.3");

        const { versions, replaced, dropped } = place(existing, entry("0.68.1.4"), 3);

        expect(replaced).toBe(1);
        expect(dropped).toEqual([]);
        expect(names(versions)).toEqual(["0.68.1.4", "0.68.1.5", "0.68.1.3"]);
    });

    test("an empty manifest ends up with the one entry", () => {
        const { versions } = place([], entry("0.68.1.1"), 10);

        expect(names(versions)).toEqual(["0.68.1.1"]);
    });
});
