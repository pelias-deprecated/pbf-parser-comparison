
Measure relative performance of PBF parsers in javascript, C++ and golang.

**note:** these tests are quite specific to our requirements for Pelias, and as such don't cover the complete functionality of each library.

Our requirements are pretty unusual in that we frequently import the whole OSM planet file (~26GB compressed) in to elasticsearch. As this can take ~20 days, any speed improvement for us will have significant impact on our dev cycles.

The tests involve decompressing a PBF extract of London stored on SSD and serializing each node/way to a single line of JSON which is then sent to stdout.

## libraries

- `osm-pbf-parser` https://github.com/substack/osm-pbf-parser
- `osm-read` https://github.com/marook/osm-read
- `node-osmium` https://github.com/osmcode/node-osmium
- `node-osmium-stream` https://github.com/geopipes/osmium-stream
- `go-osmpbf` https://github.com/qedus/osmpbf
- `py-imposm-parser` https://github.com/omniscale/imposm-parser

## results

![results](https://raw.githubusercontent.com/pelias/pbf-parser-comparison/master/results/chart.png)

you can view the [raw results output here](https://github.com/pelias/pbf-parser-comparison/blob/master/results/raw.txt)

## analysis

It seems that the golang parser `go-osmpbf` is substantially faster than the rest of the pack; most probably due to it taking advantage of multicore architecture by using many goroutines.

Surprisingly the pure javascript library `osm-pbf-parser` comes in second, most probably due to the amazing work done by @astro. There is some potential to parallelize this library; although there is a cost/benefit tradeoff for various reasons. This lib is very impressive considering it's only working on a single core.

Again it's a surprise to see that the `node-osmium` javascript bindings to the C++ library underperforming compared to the pure js version. The documentation states that it works on multiple-cores although I never managed to see that in action. The library itself is impressively feature-rich and is ideal for most usecases.

## reproduce the results yourself

Determining absolute performance is a bit of a fools errand; however if you think there may be an error in my method or you'd like to add another lib then you can re-run the tests yourself.

### prerequisites

Make sure you have the most current versions of the following installed:

- nodejs
- golang
- mercurial (for the golang dep)
- python

for impartial PBF stats I use:
- osmconvert (sudo apt-get install osmctools)

### dependencies

node/golang

```bash
go get github.com/qedus/osmpbf;
npm install;
```

python

```bash
sudo apt-get install build-essential python-dev python-pip protobuf-compiler libprotobuf-dev;
[sudo] pip install imposm.parser;
[sudo] pip install ujson;
```

### run test

```bash
bash run.sh;
```

### drive performance

For the results above I used an SSD instance on AWS with the following read performance:

```bash
$ sudo hdparm -Tt /dev/xvdb

/dev/xvdb:
 Timing cached reads:   20518 MB in  2.00 seconds = 10271.47 MB/sec
 Timing buffered disk reads: 2204 MB in  3.00 seconds = 734.64 MB/sec
```

### metro extracts

We provide PBF extracts free-of-charge at https://mapzen.com/metro-extracts/

The file I used for this test was `London, UK`. If the area you're looking for is not available, please submit a PR with your bbox and we'll add it for you!
