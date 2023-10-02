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