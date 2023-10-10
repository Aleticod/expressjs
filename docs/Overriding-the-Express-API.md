# Overriding the Express API

The Express API consists of various methods and properties on the request and response objects.</br>
These are inherited by prototype. There are two extension points for the Express API:

1. The global prototypes at **express.request** and **express.response**.
2. App-specific prototypes at **app.request** and **app.response**.

Altering the global prototypes will affect all loaded Express apps in the same process. If desired, alterations can be made app-specific by only altering the app-specific after creating a new app.

## Methods

You can override the signature and behavior of existing methods with your own, by assigning a cuntom function.</br>
Following is an example of overriding the behavior of [res.sendStatus](https://expressjs.com/4x/api.html#res.sendStatus).

    app.response.sendStatus = function(statusCode, type, message) {
      // code is intentionally kept simple for demostration purpose
      return this.contentType(type)
        .status(statusCode)
        .send(message)
    }

The above implementation completely changes the original signature of **res.sendStatus**. It now accepts a status code, encoding type, and the message to be sent to the client.</br>

The overridden method may now be used this way:

    res.sendStatus(404, 'application/json', '{"error": "resource not found"}')

## Properties

Properties in the Express API are either:

1. Assigned properties (ex: **req.baseUrl, req.originalUrl**)
2. Defined as getters (ex: **req.sercure, req.ip**)

Since properties under category 1 are dynamically assigned on the **request** and **response** objects in the context of the current-response cycle, their begavior cannot be overriden.</br>

Properties under category 2 can be overwritten using the Express API extensions API.</br>

The following code rewrites how the value of **req.ip** is to be derived. Now, it sumply returns the value of the **Client - IP** request header.

    Object.defineProperty(app.request, 'ip', {
      configurable: true,
      enumerable: true,
      get() {return this.get('Client-IP')}
    })

## Prototype

In order to provide the Express.js API, the request/response objects passed to Express.js (via **app(req, res)**, for example) need to inherit from the same prototype chain. By default this is **http.IncomingRequest.prototype** for the request and **http.ServerResponse.prototype** for the response.</br>

Unless necessary,, it is recommended that this be done only at the application level, rather than globally. Also, take care that the prototype taht is being used matches the functionality as closely as possible to the default prototypes.

    // Use FakeRequest and FakeResponse in place of http.IncomingRequest and http.ServerResponse
    // for the given app reference
    Object.setPrototypeOf(Object.getPrototypeOf(app.request), FakeRequest.prototype)
    Object.setPrototypeOf(Object.getPrototypeOf(app.reponse), FakeResponse.prototype)