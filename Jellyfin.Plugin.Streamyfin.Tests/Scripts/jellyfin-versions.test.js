// The watch that says when a Jellyfin line the build does not know about is published.
// It replaced a major number comparison that was blind to everything else, so these
// tests are mostly about the cases that comparison missed.

import { describe, expect, test } from "bun:test";

const { parse, compare, classify, builtVersionsFrom } = require("../../scripts/jellyfin-versions");

const order = (a, b) => compare(parse(a), parse(b));

describe("comparing NuGet versions", () => {
    test("numbers are compared left to right, padded to four", () => {
        expect(order("12.0.0", "10.11.11")).toBeGreaterThan(0);
        expect(order("10.11.9", "10.11.11")).toBeLessThan(0);
        expect(order("12.0", "12.0.0.0")).toBe(0);
    });

    test("a prerelease is below the release it leads to", () => {
        expect(order("12.0.0-rc7", "12.0.0")).toBeLessThan(0);
        expect(order("13.0.0-rc1", "12.1.0")).toBeGreaterThan(0);
        expect(order("12.0.0-rc1", "12.0.0-rc2")).toBeLessThan(0);
    });

    test("something that is not a version is ignored rather than coerced to zero", () => {
        for (const bad of ["latest", "", "1..2", "-1.0"]) {
            expect(parse(bad)).toBeNull();
        }
    });
});

describe("reading what the build targets", () => {
    test("every target is read, not only the first", () => {
        const props = `
          <PropertyGroup Condition="'$(JellyfinTarget)' == 'jf11'">
            <JellyfinVersion>10.11.9</JellyfinVersion>
          </PropertyGroup>
          <PropertyGroup Condition="'$(JellyfinTarget)' == 'jf12'">
            <JellyfinVersion>12.0.0</JellyfinVersion>
          </PropertyGroup>`;

        expect(builtVersionsFrom(props)).toEqual(["10.11.9", "12.0.0"]);
    });

    test("a file with none of them stops the watch rather than reporting everything", () => {
        expect(() => classify(["12.0.0"], builtVersionsFrom("<Project></Project>"))).toThrow();
    });
});

describe("classifying what is published", () => {
    const built = ["10.11.9", "12.0.0"];

    test("nothing to say when the newest published is the newest built", () => {
        const { newLines, newerInLine } = classify(["10.11.11", "12.0.0"], built);

        expect(newLines).toEqual([]);
        expect(newerInLine).toEqual([]);
    });

    // The one the shell version missed. 12.1.0 was published and nothing said anything,
    // because 12 was already a known major.
    test("a newer version inside a line already built is reported", () => {
        const { newLines, newerInLine } = classify(["12.0.0", "12.1.0"], built);

        expect(newLines).toEqual([]);
        expect(newerInLine).toEqual(["12.1.0"]);
    });

    test("a line nobody builds against is reported apart, since it needs a new target", () => {
        const { newLines, newerInLine } = classify(["12.1.0", "13.0.0"], built);

        expect(newLines).toEqual(["13.0.0"]);
        expect(newerInLine).toEqual(["12.1.0"]);
    });

    // The moment a 13 target becomes possible at all is the first 13 prerelease, not the
    // release, so a prerelease of an unknown line counts as news.
    test("a prerelease of a new line counts", () => {
        expect(classify(["13.0.0-rc1"], built).newLines).toEqual(["13.0.0-rc1"]);
    });

    // A major older than everything built here is a line that was dropped on purpose.
    test("an older line is not news", () => {
        const { newLines, newerInLine } = classify(["10.8.0", "10.9.0", "10.11.11"], built);

        expect(newLines).toEqual([]);
        expect(newerInLine).toEqual([]);
    });

    test("the report is ordered oldest first, so the issue reads in order", () => {
        const { newLines } = classify(["13.1.0", "13.0.0-rc1", "13.0.0"], built);

        expect(newLines).toEqual(["13.0.0-rc1", "13.0.0", "13.1.0"]);
    });
});
