
var pbfFilePath = process.argv[2];

var osmread = require('osm-read');

function extract( object, type ){
  if( type == 'node' ){
    return {
      type: 'node',
      id: object.id,
      lat: object.lat,
      lon: object.lon,
      tags: object.tags
    };
  } else if( type == 'way' ){
    return {
      type: 'way',
      id: object.id,
      refs: object.nodeRefs,
      tags: object.tags
    };
  } else {
    return null;
  }
}

osmread.parse({
  filePath: pbfFilePath,
  endDocument: function(){
  },
  bounds: function(bounds){
  },
  node: function(node){
    process.stdout.write( JSON.stringify( extract( node, 'node' ) ) + '\n' );
  },
  way: function(way){
    process.stdout.write( JSON.stringify( extract( way, 'way' ) ) + '\n' );
  },
  relation: function(relation){
  },
  error: function(msg){
    console.error('osm-read error',msg);
  }
});