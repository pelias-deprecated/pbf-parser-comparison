
import sys
import json
from imposm.parser import OSMParser
from collections import OrderedDict # requires python 2.7+?

# http://newbebweb.blogspot.co.uk/2012/02/python-head-ioerror-errno-32-broken.html
from signal import signal, SIGPIPE, SIG_DFL
signal(SIGPIPE,SIG_DFL)

# simple class that handles the parsed OSM data.
class JsonOutput(object):

  def nodes(self, nodes):
    for osmid, tags, coords in nodes:
      output = OrderedDict([
        ('type','node'), 
        ('id', osmid), 
        ('lat', coords[1]), 
        ('lon', coords[0]),
        ('tags', tags)
      ])
      sys.stdout.write( json.dumps(output, separators=(',',':')) + '\n' )

  def ways(self, ways):
    for osmid, tags, refs in ways:
      output = OrderedDict([
        ('type','way'), 
        ('id', osmid), 
        ('refs', refs), 
        ('tags', tags)
      ])
      sys.stdout.write( json.dumps(output, separators=(',',':')) + '\n' )

  def relations(self, relations):
    return; # do nothing (yet)

# instantiate counter and parser and start parsing
jsonify = JsonOutput()
p = OSMParser(
  # concurrency=4, # defaults to the number of CPU and cores of the host system
  nodes_callback=jsonify.nodes,
  ways_callback=jsonify.ways,
  relations_callback=jsonify.relations
)
p.parse(sys.argv[1])