export VERSION := 0.23
export GITHUB_REPO := lostb1t/jellyfin-plugin-streamyfin
export FILE := streamyfin-${VERSION}.zip

zip:
	zip -r -j "${FILE}" Jellyfin.Plugin.Streamyfin/bin/Debug/net8.0/Jellyfin.Plugin.Streamyfin.dll packages/

csum:
	md5sum "${FILE} ""

create-tag:
	git tag ${VERSION}
	git push origin ${VERSION}

create-gh-release:
	gh release create ${VERSION} "${FILE}" --generate-notes --verify-tag

update-version:
	node scripts/update-version.js
  
update-manifest:
	node scripts/validate-and-update-manifest.js

build: 
	dotnet build
  
push-manifest:
	git commit -m 'new release' manifest.json
	git push origin main

release: update-version build zip create-tag create-gh-release update-manifest push-manifest