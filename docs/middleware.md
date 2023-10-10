# Writing middleware for use in Express apps

## Overview

**Middleware** functions are functions that have access to the [request object](https://expressjs.com/en/4x/api.html#req) (**req**), the [response object](https://expressjs.com/en/4x/api.html#res) (**res**), and the **next** function in the application's request-response cycle. The **next** function is a function int he Express router which, when invoked, executes the middleware succeeding the current middleware.</br> 

Middleware functions can perform the following tasks:

* Execute any code.
* Make changes to the request and the response object.
* End the request-response cycle.
* Call the next middleware in the stack.

If the current middleware function does not end request-response cycle, it must call **next()** to pass control to the next middleware function. Otherwise, the request will be left hanging.</br>

The following figure shows the elements of a middleware function call:

![Alt text](./images/express-mw.png)

* HTTP method for which the middleware function applies.
* Path (route) for which the middleware function applies.
* The middleware function.
* Callback argument to the middleware function, called "next" by convention.
* HTTP response argument to the middleware function, called "res" by convention.
* HTTP request argument to the middleware function, called "req" by convention.

Starting with Express 5, middleware functions that return a Promise will call **next(value)** when they reject or throw an error. **next** will be called with either the rejected value or the trown Error.</br>

## Example

Here is an example of a simple "Hello world" express application. The remainder of this article will define and add three middleware functions to the application: one called **myLogger** that prints a simple log message, one called **requestTime** that display the timestamp of the HTTP request, and one called **validateCookie** that validates incoming cookies.

    const express = require('express')
    const app = express()

    app.get('/', (req, res) => {
      res.send('Hello world')
    })

    app.listen(3000)

### Middleware function myLogger

Here is a simple example of a middleware function called "myLogger". This function just prints "LOGGED" when a request to the app passes through it. The middleware function is assigned to a variable named **myLogger**.

    const myLogger = function(req, res, next){
      console.log("LOGGED")
      next()
    }

> Notice the call above to **next()**. Calling this function invokes the next middleware function in the app. The next() function is not a part of the Node.js or Express API, but is the third argument that is passed to the middleware function. The **next()** function could be named anything, but by convetion it is always named "next". To avoid confusion, always use this convention.

To load the middleware function, call **app.use()**, specifying the middleware function. for exmaple, the following code loads the **myLogger** middleware function before the route to the root path (/).

    const express = require('express')
    const app = express()

    const myLogger = function(req, res, next) {
      console.log('LOGGED')
      next()
    }

    app.use(myLogger)

    app.get('/', (req, res) => {
      res.send('Hello world')
    })

    app.listen(3000)

Every time the app receives a request, it prints the message "LOGGED" to the terminal.</br>

The order of middleware loading is important: middleware functions that are loades first are also executed first.</br>

If **myLogger** is loaded after the route to the root path, the request never reaches it and the app doesn't print "LOGGED", because the route handler of the root path terminates the request-response cycle.</br>

The middleware function **myLooger** simply prints a message, then passes on the request to the next middleware function in the stack by calling the **next()** function.

### Middleware function requestTime

Next, we'll create a middleware function called "requestTime" and add a property called **requestTime** to the request object.

    const requestTime = function(req, res, next) {
      req.requestTime = Date.now()
      next()
    }

the app now uses the **requestTime** middleware function. Also, the callback function of the root path route uses the property that the middleware function adds to **req** (the request object).

    const express = require('express')
    const app = express()

    const requestTime = function(req, res, next) {
      req.requestTime = Data.now()
      next()
    }

    app.use(requestTime)

    app.get('/', (req, res) => {
      let responseText = 'Hello world'
      responseText += `<small>Requested at: ${req.requestTime}</small>`
      res.send(responseText)
    })

    app.listen(3000)

When you make a request to the root of the app, the app now displays the timestamp of your request in the browser.

### Middleware function validateCookies

Finally, we'll create a middleware function that validates incoming cookies and sends a 400 response if cookie are invalid.</br>

Here's an example function that validates cookies with an external async service.

    async function cookieValidator (cookies) {
      try {
        await externallyValidateCookie(cookie.testCookie)
      } catch {
        throw new Error('Invalid cookies';)
      }
    }

Here we use the **cookie-parser** middleware to parser incoming cookies off the **req** object and pass them to our **cookieValidator** function. The **validateCookies** middleware returns a Promise that upon rejection will automatically trigger our erro handler.

    const express = require('express')
    const cookieParser = require('cookie-parser')
    const cookieValidator = require('./cookieValidator')

    const app = express()

    asynct function validateCookies(req, res, next) {
      await cookieValidator(req.cookies)
      next()
    }

    app.use(cookieParser())

    app.use(validateCookies)

    // Error handler
    app.use((err, req, res, next) => {
      res.status(400).send(err.message)
    })

    app.listen(3000)

> Note how **next()** is called after **await cookieValidator(req.cookies)**. This ensure that if **cookieValidator** resolves, the next middleware in the stack will get called. If you pass anything to the **next()** function (except the string **'route'** or **'router**), Express regards the current request as being an error an will skip any remaining non-error handling routing and middleware functions.

Because you have access to the request object, the response object, the next middleware function in the stack, and the whole Node.js API, the possibilities with middleware functions are endless.</br>

For more information about Express middleware, see: [Using Express middleware](https://expressjs.com/en/guide/using-middleware.html).

## Configurable middleware

If you need your middleware to be configurable, export a function which accepts an options object or other parameters, which, then return the middleware implementation based on the input parameters.</br>

file: **my-middleware.js**

    module.exports = function (options) {
      return function(req, res, next) {
        // Implement the middleware function based on the options object
        next()
      }
    }

The middleware can now be used as shown below.

    const mw = require('./my-middleware')

    app.use(mw({option1: '1', option2: '2'}))

Refer to [cookie-session](https://github.com/expressjs/cookie-session) and [compression](https://github.com/expressjs/compression) for exmaple of configurable middleware.

# Using middleware

Express is a routing and middleware web framework that has minimal functionality of its own: An Express application is essentially a series of middleware function calls.</br>

***Middleware** functions are functions that have access to the request object (**req**), the response object (**res**), and the next middleware function in the application's request-response cycle. The next middleware function is coomonly denoted by a variable named **next**.</br>

Middleware functions can perform the following tasks:

* Execute any code.
* Make changes to the request and the response objects.
* End the request-response cycle.
* Call the next middleware function in the statck.

If the current middleware function does not end the request-response cycle, it must call **next()** to pass control to the next middleware function. Otherwise, the request will be left hanging.</br>

An Express application can use the following types of middleware:

* Application-level middleware
* Router-level middleware
* Error-handling middleware
* Built-in middleware
* Third-party middleware

You can load application-level and router-level middleware with an optional mount path. You can also load a series of middleware function together, which creates a sub-stack of middleware system at a mount point.

## Application-level middleware

Bind application-level middleware to an instance of the [app object](https://expressjs.com/en/4x/api.html#app) by using the **app.use()** and **app.METHOD()** functions, where **METHOD** is the HTTP method of the request that the function handles (such as GET, PUT, or POST) in lowercase.</br>

This exmaple shows a middleware function with no mount path. The function is executed every time the app receives a request.

    const express = require('express')
    const app = express()

    app.use((req, res, next) => {
      console.log('Time:', Date.now())
      next()
    })

This example shows a middleware function mounted on the **/user/:id** path. The function is executed for nay type of HTTP request on the **/user/:id** path.

    app.use('/user/:id', (req, res, next) => {
      console.log('Request Type': req.method)
      next()
    })

This examples shows a route and its handler function (middleware system). The function handles GET request to the **/user/:id** path.

    app.get('/user/:id', (req, res, next) => {
      res.send('USER')
    })

Here is an example of loading a series of middleware functions at a mount point, with a mount path. It illustrates a middleware sub-stack that prints request info for any type of HTTP request to the **/user/:id** path.

    app.use('/user/:id', (req, res, next) => {
      console.log('Request URL:', req.originalUrl)
      next()
    }, (req, res, next) => {
      console.log('Request Type:', req.method)
      next()
    })

Route handlers enable you to define multiple routes for a path. The example below defines two routes for GET requests to the **/user/:id** path. The sencond route will no cause any problems, but it will never get called because the first route ends the request-response cycle.</br>

This exmaple shows a middleware sub-stack that handles GET request to the **/user/:id** path.

    app.get('/user/:id', (req, res, next) => {
      console.log('ID:', req.params.id)
      next()
    }, (req, res, next) => {
      res.send('User Info')
    })

    // handler for the /user/:id path, which prints the user ID
    app.get('/user/:id', (req, res, next) => {
      res.send(req.params.id)
    })

To skip the rest of the middleware functions from a router middleware stack, call **next('route')** to pass control to the next route. **NOTE**: **next('route')** will work only in middleware functions that were loaded by using the **app.METHOD()** or **router.METHOD()** funtions.</br>

This examples shows a middleware sub-stack that handles GET requests to the **/user/:id** path.

    app.get('/user/:id', (req, res, next) => {
      // if the user ID i 0, skip to the next route
      if (req.params.id === '0') next('route')
      // otherwise pass the control to the next middleware function in this stack
      else next()
    }, (req, res, next) => {
      // send a regular response
      res.send('regular')
    })

    // handler for the /user/:id path, wich sends a special response
    app.get('/user/:id', (req, res, next) => {
      res.send('special')
    })

Middleware can also be declared in an array for reusability.</br>

This example shows an array with a middleware sub-stack that handles GET requests to the **/user/:id** path.

    function logOriginalUrl (req, res, next) {
      console.log('Request URL:', req.originalUrl)
      next()
    }

    function logMethod (req, res, next) {
      console.log('Request Type:', req.method)
      next()
    }

    const logStuff = [logOriginalUrl, logMethod]

    app.get('/user/:id', logStuff, (req, res, next) => {
      res.send('User Info')
    })

## Router-level middleware

Router-level middleware works in the same way as application-level middleware, except it is bound to an instance of **express.Router()**.

    const router = express.Router()

Load router-level middleware by using the **router.use()** and **router.METHOD()** functions.</br>

The following example code replicates the middleware system that is shown above for application-level middleware, by using router-level middleware.

    const express = require('express')
    const app = express()
    const router = express.Router()

    // a middleware function with no mount path. This code is executed for every request to the router
    router.use((req, res, next) => {
      console.log('Time:', Date.now())
      next()
    })

    // a middleware sub-stack shows request info for any type of HTTP request to the /user/:id path
    router.use('/user/:id', (req, res, next) => {
      console.log('Request URL:', req.originalUrl)
      next()
    }, (req, res, next) => {
      console.log('Request type:', req.method)
    })

    // a middleware sub-stack that handles GET requests to the /user/:id path
    router.get('/user/:id', (req, res, next) => {
      // if the user ID is 0, skip to the next router
      if (req.params.id === '0') next('route')
      // otherwise pass control to the next middleware function in this stack
      else next()
    }, (req, res, next) => {
      // render a regular page
      res.send('regular')
    })

    // handler for the /user/:id path, which renders a special page
    router.get('/user/:id', (req, res, next) => {
      console.log(req.params.id)
      res.render('spacial')
    })

    // mount the router on the app
    app.use('/', router)

To skip the rest of the router's middleware functions, call **next('router')** to pass control back out of the router instance.</br>

This example shows a middleware sub-stack that handles GET requests to the **/user/:id** path.

    const express = require('express')
    const app = express()
    const router = express.Router()

    // predicate the router with a ckeck and bail out when needed
    router.use.((req, res, next) => {
      if(!req.headers['x-auth']) return next('router')
      next()
    })

    router.get('/user/:id', (req, res) => {
      res.send('hello, user!')
    })

    // use the router and 401 anything falling through
    app.use('/admin', router, (req, res) => {
      res.sendStatus(401)
    })

## Error-handling middlware

> Error-handling middleware always take **four** arguments. You must provide four arguments to identify it as an error-handling middleware function. Even if you don't need to use the **next** object, you must specify it to maintain the signature. Otherwise, the **next** object will be interpreted as regular middleware and will fail to handle errors.

Define error-handling middleware functions in the same way as other middleware functions, except with four arguments instead of three, specifically with the signature **(err, req, res, next)**:

    app.use((err, req, res, next) => {
      console.error(err.stack)
      res.status(500).send('Something broke!')
    })

For details about error-handling middleware, see: [Error handling](https://expressjs.com/en/guide/error-handling.html).

## Built-in middleware

Starting with version 4.x, Express no longer depends on [Connect](https://github.com/senchalabs/connect). The middleware functions that were previously included with Express are now in separate modules; see [the list of middleware functions](https://github.com/senchalabs/connect#middleware).</br>

Express has the following built-in middleware functions:

* [express.static](https://expressjs.com/en/4x/api.html#express.static) serves static assets such as HTML files, images, and so on.
* [express.json](https://expressjs.com/en/4x/api.html#express.json) parses incoming requests with JSON payloads. **NOTE: Available with Express 4.16.0+**
* [express.urlencoded](https://expressjs.com/en/4x/api.html#express.urlencoded) parses incoming requests with URL-encoded payloads. **NOTE: Available with Express 4.16.0+**

## Third-party middleware

Use third-party middleware to add functionality to Express apps.</br>

Install the Node.js module for the required functionality, then load it in your app at the application level or at the router level.</br>

The following example illustrates installing and loading the cookie-parsing middleware function **cookie-parser**.</br>

`npm install cookie-parser`

    const express = require('express')
    const app = express()
    const cookieParser = require('cookie-parser')

    // load the cookie-parsing middleware
    app.use(cookieParser)

For a partial list of third-party middleware functions that are commonly used with Express, see: [Third-party middleware](https://expressjs.com/en/resources/middleware.html).