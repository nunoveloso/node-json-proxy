
var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , config = {
			hostname : '127.0.0.1',
			port : 3085
		}
  , config_path = './config.json'


/**
 * Create server.
 */
fs.exists(config_path, function(exists) {
	// load any additional or overriding config
	if (exists) {
		var config_json = require('./config.json')
		for (var c in config_json) {
			config[c] = config_json[c]
		}
		console.log("Config loaded: " + JSON.stringify(config))
	}

	// starts the http server
	http.createServer(json_proxy).listen(config.port, config.hostname, function(){
	  console.log("Server listening on port " + config.port)
	})
})



function json_proxy(req, res) {

	var requested_url = decodeURIComponent(req.url.replace(/^\//, ''))
	console.log("Requested URL to be proxied: " + requested_url)

	if (requested_url.length) {
		console.log("Proxying URL: " + requested_url)

		// Request URL
		http
		.request(requested_url, function(response) {
			console.log("Got response: " + response.statusCode)

			// prepare header of local response
			// re-use remote ones and also add no control on source
			res.writeHead(200, {
				'Content-Type': response.headers['content-type'] || 'application/json',
				'Access-Control-Allow-Origin': "*"
			})

			// buffer the data
			var buffer = new Buffer(0)
			response.on('data', function(d) {
				buffer += d
			})

			// once we are done with their response, we send it
			response.on('end', function() {
				console.log('Response has been buffered.')

				try {
				  // var json = JSON.parse(this.responseText)
				  res.end(JSON.stringify(JSON.parse(buffer.toString()), false))
				}
				catch(e) {
				  console.log('Remote "' + requested_url + '" sent and invalid JSON, skipping.')
				}
			})
		})
		// handle errors
		.on('error', function(e) {
			console.log("Got error: " + e.message)

			res.write(JSON.stringify({ error: e.message }))
			res.end()
		})
		.end()
	}
	else {
		res.end('Skipping URL: ' + requested_url, 400)
	}
}


