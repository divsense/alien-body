'use strict';

var debugMode;

var cache = {};

var source = [
   	"change",
   	"signal",
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
	
		debugMode && console.log( "ALIEN EVENT:", req.source, req.params );

		post( req.source, req.params, res, next );
	}
	else{
		debugMode && console.log( "ALIEN ERROR. Unknown source:", req.source );
	}

}

var getMessage = function( evt ){


	try{
		var req = JSON.parse( evt.data );

		debugMode && console.log( "ALIEN. Message from Divsense:", req );

		var res = {
			id:		req.id,
		};

		emit( req, res, postMsg );

	}
	catch(e){
		debugMode && console.log( "ALIEN ERROR. invalid message:", evt.data );
	}

	function postMsg(r){
		try{
			var data = JSON.stringify( r );
			evt.source.postMessage( data, evt.origin );
		}
		catch(e){
			debugMode && console.log( "ALIEN ERROR. invalid response format:", r );
		}
	}
}

module.exports = function( id, debug, origin ){

	var targetOrigin = origin || "http://divsense.com";

	debugMode = debug || false;

	debugMode && console.log( "ALIEN IS UP. [ID:" + id + ", DEBUG: " + debug + ", TARGET ORIGIN: " + targetOrigin + "]");

	window.onload = function(){
		var msg = { id: id, action: "alive" };
		parent.postMessage( JSON.stringify(msg), targetOrigin );
	}

	window.addEventListener("message", getMessage, false );

	return {
		on:on
	}

}
