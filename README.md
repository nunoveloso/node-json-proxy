node-json-proxy
===============

Node.js server that proxies remote JSON requests to localhost (or any given hostname).

# Usage

Run the app:
```
$ node app.js
```

In your app, call:
```
http://localhost:3085/http%3A%2F%2Fexample.com%2Fmy%2Fsub%2Fpath%3Fsome%3Dquery%26another%3Done
```
It is important that you make sure you encode the remote URL you want to proxy, so
```
http://example.com/my/sub/path?some=query&another=one
```
becomes:
```
http%3A%2F%2Fexample.com%2Fmy%2Fsub%2Fpath%3Fsome%3Dquery%26another%3Done
```

# Config

If you want to override default config, just create a `config.json` file as follows:
```json
{
  "hostname": "127.0.0.1",
  "port": "1234"
}
```

