
var pbfFilePath = process.argv[2];

var parseOSM = require('osm-pbf-parser');
var fs = require('fs');
var through = require('through2');

var osm = parseOSM();
var file = fs.createReadStream( pbfFilePath );

function extract( object ){
  if( object.type == 'node' ){
    return {
      type: 'node',
      id: object.id,
      lat: object.lat,
      lon: object.lon,
      tags: object.tags
    };
  } else if( object.type == 'way' ){
    return {
      type: 'way',
      id: object.id,
      refs: object.refs,
      tags: object.tags
    };
  } else {
    return null;
  }
}
 
file
  .pipe(osm)
  .pipe(through.obj(function (row, enc, next) {
    row.forEach( function( item ){
      var e = extract( item );
      if( e ) process.stdout.write( JSON.stringify( extract( item ) ) + '\n' );
    }, this );
    next();
  }))
  .on( 'error', console.error.bind(console,'osm-pbf-parser error') );