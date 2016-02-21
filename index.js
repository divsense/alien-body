'use strict';

var debugMode;

var cache = {};

var events = [
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

	if( events.indexOf( req.event ) !== -1 ) {
	
		debugMode && console.log( "ALIEN EVENT:", req.event, req.params );

		post( req.event, req.params, res, next );
	}
	else{
		debugMode && console.log( "ALIEN ERROR. Unknown event:", req.event );
	}

}

var getMessage = function( evt ){

	var req = evt.data;

	if( !req.id ){
		debugMode && console.log( "ALIEN ERROR. invalid message:", evt.data );
	}
	else{
		debugMode && console.log( "ALIEN. Message from Divsense:", req );

		var res = {
			id:		req.id
		};

		emit( req, res, postMsg );

	}

	function postMsg(data){
		evt.source.postMessage( data, evt.origin );
	}
}

module.exports = function( id, debug, origin ){

	var targetOrigin = origin || "http://divsense.com";

	debugMode = debug || false;

	debugMode && console.log( "ALIEN IS UP. [ID:" + id + ", DEBUG: " + debug + ", TARGET ORIGIN: " + targetOrigin + "]");

	window.onload = function(){
		var msg = { id: id, action: "recover" };
		parent.postMessage( msg, targetOrigin );
	}

	window.addEventListener("message", getMessage, false );

	return {
		on:on
	}

}
