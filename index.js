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
	
		debugMode && console.log( "ALIEN-BODY EVENT:", req.source, req.method );

		post( req.source, req, res, next );
	}
	else{
		debugMode && console.log( "ALIEN-BODY ERROR. UNKNOWN SOURCE:", req.source );
	}

}

var getMessage = function( evt ){


	try{
		var req = JSON.parse( evt.data );

		debugMode && console.log( "ALIEN-BODY. msg from divsense:", req );

		var res = {
			id:		req.id,
			status: "ok",
			content: {}
		};

		emit( req, res, postMsg );

	}
	catch(e){
		debugMode && console.log( "ALIEN-BODY error. invalid message:", evt.data );
	}

	function postMsg(r){
		try{
			var data = JSON.stringify( r );
			evt.source.postMessage( data, evt.origin );
		}
		catch(e){
			debugMode && console.log( "ALIEN-BODY error. invalid response:", r );
		}
	}
}

module.exports = function( id, debug, origin ){

	debugMode = debug || false;

	debugMode && console.log( "ALIEN-BODY IS UP. [ID:" + id + ", DEBUG: " + debug + ", TARGET ORIGIN: " + origin + "]");

	window.onload = function(){
		var msg = { id: id, status: "alive" };
		parent.postMessage( JSON.stringify(msg), origin );
	}

	window.addEventListener("message", getMessage, false );

	return {
		on:on
	}

}
