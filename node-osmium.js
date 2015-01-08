
var pbfFilePath = process.argv[2];

var osmium = require('osmium');
var file = new osmium.File( pbfFilePath );
var reader = new osmium.Reader( file, { node: true, way: true, relation: false } );

function extract( object ){
  if( object instanceof osmium.Node ){
    return {
      type: 'node',
      id: object.id,
      lat: object.lat,
      lon: object.lon,
      tags: object.tags()
    };
  } else if( object instanceof osmium.Way ){
    return {
      type: 'way',
      id: object.id,
      refs: object.node_refs(),
      tags: object.tags()
    };
  } else if( object instanceof osmium.Relation ){
    return {
      type: 'relation',
      id: object.id
    };
  } else {
    console.log( 'unkown type', object.constructor.name );
    return null;
  }
}

var handler = new osmium.Handler();
handler.on('node', function(node) {
  process.stdout.write( JSON.stringify( extract( node ) ) + '\n' );
});
handler.on('way', function(way) {
  process.stdout.write( JSON.stringify( extract( way ) ) + '\n' );
});
handler.on('relation', function(relation) {
  process.stdout.write( JSON.stringify( extract( relation ) ) + '\n' );
});

osmium.apply(reader, handler);