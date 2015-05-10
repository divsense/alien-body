# Divsense Alien Body

## Usage:
```javascript
var alienId = "my-cool-divsense-alien";
var alienBody = require("alien-body")( alienId );

alienBody.on("head", handleHeadEvent );

function handleHeadEvent( req, res, next ){

	if( req.method === "init" ){
		res.content.head = {
		  icon: "fa-star",
		  text: "AnotherAlien"
		}
	}
  
	next( res );

}


```
