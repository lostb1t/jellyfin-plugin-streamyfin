// The two list operations a manifest update performs, kept apart from the script that
// performs them. Everything else in validate-and-update-manifest.js is a network call or
// a file write, so this is the part that can be tested, and it is the part where an off
// by one silently drops a published entry.

/**
 * Place an entry in a manifest's version list.
 *
 * @param {Array<{version: string}>} versions Existing entries, newest first.
 * @param {{version: string}} entry The entry being published.
 * @param {number|null} keep How many entries to keep, or null to keep every one.
 * @returns {{versions: Array, replaced: number, dropped: Array}}
 */
function place(versions, entry, keep) {
    // Drop any entry for this version before adding it. Without this, republishing a
    // version leaves two entries for it and Jellyfin shows the plugin twice.
    const kept = versions.filter((v) => v.version !== entry.version);
    const replaced = versions.length - kept.length;

    // Newest first is how the file is written and how Jellyfin reads it. MergeSortedList
    // in the server assumes that order when it merges two repositories.
    kept.unshift(entry);

    // A release manifest keeps every version it ever published, because somebody may
    // want to pin an old one. An unstable manifest has no such claim on anyone: its
    // entries point at prereleases that exist to be replaced, and left unpruned it gains
    // one entry per build forever.
    const dropped = keep === null ? [] : kept.splice(keep);

    return { versions: kept, replaced, dropped };
}

module.exports = { place };
