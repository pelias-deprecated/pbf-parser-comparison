
var util = require('util'),
    through = require('through2'),
    split = require('split');

var prev = 0,
    total = 0,
    times = [];

var log = function(p){
  if(!p){ times.push(total-prev); }
  // console.error( util.format('[%s%d/s] %d', p || '', total-prev, total ) );
  prev = total;
};

var end = function(){
  if( times.length ){
    var sum = times.reduce(function(a, b) { return a + b; });
    var avg = sum / times.length;
    console.error( util.format('avg: %s, total: %d', avg, total ) );
  }
  clearInterval( i );
  log('~');
};

var transform = function( chunk, enc, next ){
  total++;
  this.push( chunk );
  next();
};

var i = setInterval( log, 1000 );

process.stdin
  .pipe( split() )
  .pipe( through( transform, end))
  .pipe( process.stdout );