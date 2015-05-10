'use strict';

var debugMode;

var cache = {};

var source = [
   	"head",
   	"channel",
   	];

var on = function( evt, fn ){

	cache[evt] = cache[evt] || [];

	cache[evt].push( fn );

	return [evt,fn];
}

var post = function( evt, req, res, next  ){
	cache[evt] && cache[evt].forEach( function( sub ){
		sub( req, res, next );
	});
}

var emit = function( req, res, next ){

	if( source.indexOf( req.source ) !== -1 ) {
	
		debugMode && console.log( "ALIEN-BODY EVENT:", req.source, req.method );

		post( req.source, req, res, next );
	}
	else{
		debugMode && console.log( "ALIEN-BODY ERROR. INVALID METHOD:", req.source );
	}

}

var getMessage = function( evt ){


	try{
		var req = json.parse( evt.data );

		debugmode && console.log( "alien-body. msg from divsense:", req );

		var res = {
			id:		req.id,
			status: "ok",
			content: {}
		};

		emit( req, res, function(res){
			evt.source.postmessage( json.stringify( res ), evt.origin );
		});

	}
	catch(e){
		debugmode && console.log( "alien-body error. invalid message:", evt.data );
	}


}

module.exports = function( id, debug ){

	debugMode = debug || false;

	debugMode && console.log( "ALIEN-BODY IS UP");

	window.onload = function(){
		var msg = { id: id, status: "alive" };
		parent.postMessage( JSON.stringify(msg), "*" );
	}

	window.addEventListener("message", getMessage, false );

	return {
		on:on
	}

}
