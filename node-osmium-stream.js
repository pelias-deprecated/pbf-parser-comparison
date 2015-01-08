
var pbfFilePath = process.argv[2];

var OsmiumStream = require('osmium-stream');
var through = require('through2');

var file = new OsmiumStream.osmium.File( pbfFilePath );
var reader = new OsmiumStream.osmium.Reader( file, { node: true, way: true, relation: false } );
var parser = new OsmiumStream( reader );

parser.pipe( through.obj( function( item, enc, next ){
  process.stdout.write( JSON.stringify( item ) + '\n' );
  next();
}));