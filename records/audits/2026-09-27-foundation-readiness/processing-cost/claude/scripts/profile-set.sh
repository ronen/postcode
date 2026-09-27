#!/bin/bash
# Usage: profile-set.sh SIZE  (profiles steady-state org/dependency lenses; FIRST=1 profiles the first request)
B=/Users/ronen/postcode/app/_build; S=$1; P=${FIRST:+first-}
run() { echo "=== $S $P$3"; node scripts/profile-request.mjs $B synthetic/$S/tsconfig.json "$1" "$2" results/$S-$P$3.cpuprofile "" $4 && node scripts/summarize-profile.mjs results/$S-$P$3.cpuprofile 12 | cut -c1-150; }
run organization unicode org-project project
run organization json org-repo-json repository
run dependencies json deps-json
run dependencies unicode deps-unicode
