export VERSION := 0.3
export GITHUB_REPO := lostb1t/jellyfin-plugin-streamyfin
export FILE := streamyfin-${VERSION}.zip

build: 
	dotnet build

zip:
	zip "${FILE}" Jellyfin.Plugin.Streamyfin/bin/Debug/net8.0/Jellyfin.Plugin.Streamyfin.dll YamlDotNet.dll

csum:
	md5sum "${FILE} ""

create-tag:
	git tag ${VERSION}
	git push origin ${VERSION}

create-gh-release:
	gh release create ${VERSION} "${FILE}" --generate-notes --verify-tag

update-files:
	node scripts/update-version.js
	node scripts/validate-and-update-manifest.js

push-manifest:
	git commit -m 'new release' manifest.json
	git push origin main

release: build zip create-tag create-gh-release update-files push-manifest