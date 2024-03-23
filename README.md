# Quick Node.js static dev server

This is a static web server (based on [Express.js](https://expressjs.com/)) that I wrote for the purpose of locally serving static HTML website projects during development. I'm sharing it here in case it could be of interest to anyone.

## How to install and use

### NPM project scope

```shell
# Install the package
npm install --save-dev @bb301/quick-static-dev-server

# Run the server
npx quick-static-dev-server
```
### Globally

```shell
# Install globally
npm install -g @bb301/quick-static-dev-server

# Use from anywhere
quick-static-dev-server
```

## Configurations

For the moment, server configurations must be done using the following optional environment variables:

* `QUICK_SERVER_PORT` – (default: `28080`) The server's port number.
* `QUICK_SERVER_HOSTNAME` – (default: `127.0.0.1`) The server's hostname.
* `QUICK_SERVER_PUBLIC_DIR_PATH` – (default: `./`; i.e., the directory where the program is run) The directory from where static files will be served.
* `QUICK_SERVER_HTML_INDEX_NAME` – (default: `index.html`) The HTML file to be served for requests made to the `GET /` endpoint.
* `QUICK_SERVER_SSL_CERT_PATH` – The path of the SSL certificate file to be used (enables HTTPS).
* `QUICK_SERVER_SSL_KEY_PATH` – The path of the SSL private key file to be used (enables HTTPS).

### Example

This is a simple example that illustrates the deployment of a static website on `0.0.0.0:80`. The files located inside the `./website` directory will be served and requests to the `GET /` endpoint will be returned the contents of `./website/home.html`.

```shell
# Server will listen on port 80
export QUICK_SERVER_PORT=80
# Server will be exposed on the LAN
export QUICK_SERVER_HOSTNAME=0.0.0.0
# Server will serve files from the `./website` directory
export QUICK_SERVER_PUBLIC_DIR_PATH=./website
# Server will return `./website/home.html` for requests to `GET /`
export QUICK_SERVER_HTML_INDEX_NAME=home.html

# Start the server
quick-static-dev-server
```

## Contact

If you have any questions, if you find bugs, or if you have suggestions for this project, please feel free to contact me by opening an issue on the [repository](https://github.com/BB-301/quick-static-dev-server/issues).

## License

This project is released under the [MIT License](https://github.com/BB-301/quick-static-dev-server/blob/main/LICENSE).

## Copyright

Copyright (c) 2024 BB-301 (fw3dg3@gmail.com)