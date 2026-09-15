# Compat

Everything that differs between Jellyfin 10.11 and Jellyfin 12 lives here, and
nowhere else. No file outside this folder may branch on `JF11`, `JF12`,
`NET9_0` or `NET10_0`. `CompatBoundaryTests` fails the build if one does.

The rule exists so that dropping a Jellyfin version stays a deletion rather
than an archaeology exercise. Version specific code scattered through the
domain is exactly what makes old runtimes impossible to retire.

## Dropping Jellyfin 10.11, when the time comes

1. Delete the `jf11` `PropertyGroup` from `Directory.Build.props` and make
   `jf12` the default.
2. Delete the `jf11` entry from the `build.yml`, `release.yml` and
   `prerelease.yml` matrices.
3. Delete every `#if JF11` branch in this folder, keeping the `JF12` side.
4. Drop the 10.11 manifests, `manifest.json` and `manifest-unstable.json`, and
   stop publishing that artifact. `manifest.json` is the URL the oldest servers
   were told to use, so it is the one file here that cannot simply be renamed.

Nothing else in the codebase should need to change. If it does, something
leaked out of this folder and the guard test was bypassed.

## Adding a Jellyfin line, when the time comes

The reverse of the list above, and it is meant to stay this short.

**Read again on 2026-09-15.** Jellyfin released 12.1 that morning, cut from a
release branch, and `master` is still versioned 13.0.0 and still on `net10.0`. The
two have diverged: `master` is 62 commits ahead of 12.1 and 148 behind it. Nothing
publishes a `13.*` package, on NuGet or anywhere else. Jellyfin's old unstable feed
on Azure DevOps answers, but its newest `Jellyfin.Controller` is `10.7.0-20200923`,
so it has been dead for five years. **There is nothing to compile a `jf13` target
against**, and a `manifest-jf13.json` would carry the same artifact as the 12 one.

That last part is the thing worth knowing rather than guessing: `targetAbi` is a
floor, not a target. `InstallationManager` keeps a version when
`Version.Parse(x.TargetAbi) <= appVer`, so the `jf12` build, compiled against
12.0.0 and on the same `net10.0` as `master`, is what a 13 server installs today.
Adding a 13 target is worth doing when 13 breaks something, not when 13 exists.

`nuget-watch.yml` says so the day a package appears, including a release candidate,
which is the moment a target becomes possible at all.

1. Add a `PropertyGroup` to `Directory.Build.props` for the new target, with its
   `TargetFramework`, `JellyfinVersion`, `JellyfinAbi`, `EfCoreVersion` and its
   `DefineConstants`. The floor is the oldest server the plugin actually uses,
   not the oldest of the line: 10.11.9 is the floor of `jf11` because
   `IUserManager.Users` became `GetUsers()` inside that patch line.
2. Add it to the matrices in `build.yml`, `release.yml` and `prerelease.yml`,
   with the SDK it needs.
3. Give it its own manifest file names. The `Makefile` builds them from the
   channel and the target, so a new line needs a `manifest-jfNN.json` and a
   `manifest-unstable-jfNN.json` created beside the others, and the suffix falls
   out of `MANIFEST_SUFFIX`. The oldest line keeps `manifest.json` with no suffix,
   so servers already pointed at that URL do not break. Two builds cannot share a
   manifest: they carry the same version with a different `targetAbi`, and the
   deduplication in `validate-and-update-manifest.js` would keep only one.
4. Build both. Anything that fails to compile is a real difference, and it goes
   in this folder behind `#if`, not where it was found.

Two things that are worth checking before assuming a target is only a version
number, because both bit this plugin on the 10.11 to 12 move:

- **The EF Core version the host provides.** The plugin references it but the
  server loads it, so a plugin ahead of its host fails to load. Read
  `Directory.Packages.props` in the Jellyfin release rather than taking the
  newest.
- **A breaking change inside a patch line.** `IUserManager.Users` disappeared in
  10.11.9, which is why no single artifact covers 10.11.0 through 10.11.11.
