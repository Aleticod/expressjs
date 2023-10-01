# Routing

***Routing*** refers to how an application's endpoints (URIs) respond to client requests.</br>

You define routing using methods of the Express **app** object that correspond to HTTP methods; for example, **app.get()** to handle GET requests and **app.post()** to handle POST requests. For a full list, see [app.METHOD](https://expressjs.com/en/4x/api.html#app.METHOD). You can also use **app.all()** to handle all HTTP methods and **app.use()** to specify middleware as the callback function (See [Using middleware](https://expressjs.com/en/guide/using-middleware.html) for details).</br>

These routing methods specify a callback function (sometimes called "handler functions") called when the application receives a request to the specified route (endpoint) and HTTP method. In other words, the application "listens" for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function.</br>

In fact, the routing methods can have more than one callback function as arguments. With multiple callback functions, it is important to provide **next** as an argument to the callback function and then call **next()** within the body of the function to hand off control to the next callback.</br>

The following code is an example of a very basic route.

    const express = require('express')
    const app = express()

    // responde with "hello world" when a GET request is made to the homepage
    app.get('/', (req, res) ={
      res.send("hello world")
    })

## Route methods

A route method is derived from one of the HTTP methods, and is attached to an instance of the **express** class.</br>

The following code is an example of routes that are defined for the GET and the POST methods to the root of the app.

    // GET method route
    app.get('/', (req, res) => {
      res.send('GET request to the homepage')
    })

    // POST method route
    app.post('/', (req, res) => {
      res.send('POST request to the homepage')
    })

Express supports methos that correspond to all HTTP request methods: **get, post**, and so on.</br>

There is a special routing method, **app.all()**, used to load middleware functions at a path for **all** HTTP request methods. For example, the following handler is executed for requests to the route "/secret" whether using GET, POST, PUT, DELETE, or many other HTTP request method supported inthe [http module](https://nodejs.org/api/http.html#http_http_methods).

    app.all('/secret', (req, res, next) => {
      console.log('Accesing the secret section')
      next() // pass control to the next handler
    })

## Route paths

Route paths, in combination with a request method, define the endpoints at which requests can be made. Route paths can be strings, string patterns, or regular expressons.</br>

The characters **?, +, \*** and **()** are subsets of their regular expresssions counterparts. The hyphen (-) and the dot (.) are interpreted literally by strings-based paths.</br>

If you need to use the dollar character ($) in the path string, enclose it escaped within ([and]). for example, the path string for a request at "/data/$book", would be `"/data/([\$])book"`.</br>

> Express uses [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) for matching the route paths; see the path-to-regexp documentation for all the possibilities in defining route paths. [Express Route Tester](http://forbeslindesay.github.io/express-route-tester/) is a handy tool for testing basic Express routes, although it does not support pattern matching.

> Query string are not part of the route path

Here are some examples of route paths based on strings.</br>

This route path will match requests to the root route, **/**.

    app.get('/', (req, res) => {
      res.send('root')
    })

This route path will match request to **/about**

    app.get('/about', (req, res) => {
      res.send('about')
    })

This route path will match request to **/random.text**.

    app.get('/random.text', (req, res) => {
      res.send('random.text')
    })


Here are some examples of route paths based on string patterns.</br> 

This route path will match **acd** and **abcd**.

    app.get('/ab?cd', (req, res) => {
      res.send('ab?cd')
    })

This route path will match **abcd, abbcd, abbbcd**, and so on.

    app.get('/ab+cd', (req, res) => {
      res.send('ab+cd')
    })

This route path will match **abcd, abxcd, abRANDOMcd, ab123cd**, and so on.

    app.get('/ab*cd', (req, res) => {
      res.send('ab*cd')
    })

This route path will match **/abe** and **/abcde**.

    app.get('/ab(cd)?e', (req, res) => {
      res.send('ab(cd)?e')
    })

Examples of route paths based on regular expressions:</br>

This route path will match anything with an "a" in it.

    app.get(/a/, (req, res) => {
      res.send('/a/')
    })

This route path will match **butterfly** and **drangonfly**, but not **butterflyman**, **drangonflyman**, and so on.

    app.get(/.*fly$/, (req, res) => {
      res.send('/.*fly$/')
    })

### Route parameters

Route parameters are named URL segments that are used to capture the values specified at their position in the URL. The captured values are populated in the **req.params** object, with the name of the route parameter specified in the path as their respective keys.

    Rute path: /users/:userId/books/:bookId
    Request URL: http://localhost:3000/users/34/books/8078
    req.params: { "userId": "34", "bookId": "8078" }

To define routes with route parameters, simply specify the route parameters in the path of the route as shown below.

    app.get('/user/:userId/books/:bookId', (req, res) => {
      res.send(req.params)
    })

> The name of route parameters must be made up of "word characters" ([A-Za-z0-9])

Since the hyphen (-) and dot (.) are interpreted literally, they can be used along with route parameters for useful purposes.

    Route path: /flights/:from-:to
    Request URL: http://localhost:3000/flights/LAX-SFO
    req.params: {"from": "LAX", "to": "SFO"}


    Route path: /plantae/:genus.:species
    Request URL: http://localhost:3000/plantae/Prunus.persica
    req.params: {"genus": "Prunus", "species": "persica"}

To have more control over the exact string that can be matched by a route parameters, you can append a regular expression in the parenthesis (**()**):

    Route path: /user/:userId(\d+)
    Request URL: http://localhost:3000/user/42
    req.params: {"userId": "42"}

> Because the regular expressons is usually part of a literal string be sure to scape any \ characters with an addition backslash, for example `\\d+`

## Route handlers

You can provide multiple callback functions that behave like [middleware](https://expressjs.com/en/guide/using-middleware.html) to handle a request. The only exception is that these callbacks might invoke **next ('route')** to bypass the remaining route callbacks. You can use this mechanism to impose pre-conditions on a route, then pass control to subsequent routes if there's no reason to proceed with the current route.</br> 

Route handlers can be in the form of a function, an array of functions, or combinations of both, as show in the following examples.</br>

A single callback function can handle a route. For example:

    app.get('/example/a', (req, res) => {
      res.send('Hello from A')
    })

More than one callback function can handle a route (make sure you specify the **next** object). For example:

    app.get('/example/b', (req, res, next) => {
      console.log('the response will be sent by the next function ...')
      next()
    }, (req, res) => {
      res.send('Hello from B')
    })

An array of callback functions can handle a route. For example:

    const cb0 = function(req, res, next) {
      console.log('CB0')
      next()
    }

    const cb1 = function(req, res, next) {
      console.log('CB1')
      next()
    }

    const cb2 = function(req, res) {
      res.send('Hello from c')
    }

    app.get('/example/c', [cb0, cb1,cb2])

A combination of independent functions and arrays of functions can handle a route. For example:

    const cb0 = function(req, res, next) {
      console.log('CB0')
      next()
    }

    const cb1 = function(req, res, next) {
      console.log('CB1')
      next()
    }

    app.get('/example/d', [cb0, cb1], (req, res, next) => {
      console.log('The response will be sent by the next function ...')
    }, (req, res) => {
      res.send('Hello from D')
    })