#!/bin/bash

# PBF_FILE='/media/hdd/mapzen-metro/london_england.osm.pbf';
PBF_FILE='/media/hdd/mapzen-metro/wellington_new-zealand.osm.pbf';
# PBF_FILE='/media/hdd/somes.osm.pbf';

echo; echo '--- pbf stats ---'; echo;
echo "file: $PBF_FILE"; echo;
osmconvert --out-statistics $PBF_FILE; echo;

stats(){
  echo "total lines: `cat tmpfile | wc -l`";
  echo "total nodes: `cat tmpfile | grep '\"node\"' | wc -l`";
  echo "total ways: `cat tmpfile | grep '\"way\"' | wc -l`";
  echo "shasum: (`shasum tmpfile`)";
}

# echo '--- osm-pbf-parser ---';
# time node osm-pbf-parser $PBF_FILE >tmpfile;
# stats; rm tmpfile; echo;

# echo '--- osm-read ---';
# time node osm-read $PBF_FILE >tmpfile;
# cp tmpfile tmp1;
# stats; rm tmpfile; echo;

# echo '--- node-osmium ---';
# time node node-osmium $PBF_FILE >tmpfile;
# cp tmpfile tmp2;
# stats; rm tmpfile; echo;

# echo '--- node-osmium-stream ---';
# time node node-osmium-stream $PBF_FILE >tmpfile;
# stats; rm tmpfile; echo;

echo '--- go-osmpbf ---';
time go run osmpbf.go $PBF_FILE >tmpfile;
stats; rm tmpfile; echo;

echo '--- py-imposm-parser ---';
time python imposm-parser.py $PBF_FILE >tmpfile;
stats; rm tmpfile; echo;
