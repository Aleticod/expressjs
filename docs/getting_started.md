# Installing

Assuming you've already installed Node.js, create a directory to hold your application, and make that your working directory.

    mkdir myapp
    cd myapp

Use the npm `init` command to create a `package.json` file for your application. For more information on how `package.json` works, see [Specifics on npm's package.json handling](https://docs.npmjs.com/files/package.json). </br>

    npm init

This command prompts your for a number of things, such as the name and version of your application. For now, you can simply hit RETURN to accept the defaults for most of them, with the following exception.

    entry point: (index.js)

Enter `app.js`, or whatever you wnat the name of the main file to be. If you want it to be `index.js`, RETURN to accept the suggested default file name.</br>

Now install Express in the `myapp` directory and save it in the dependencies list. For example.</br>

    npm install express

To install Express temporarily and not add it to the dependencies list:</br>

    npm install express --no-save

# Hello world example

    const express = require('express');
    const app = express();
    const port = 3000;

    app.get('/', (req, res) => {
      res.send('Hello world');
    })

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}``)
    })

This app starts a server and listens on port 3000 for connections. the app responds with "Hello World" for requests to the root URL `(/)` or route. For every other path, it will respond with a **404 Not Found**.</br>

## Running Locally

Run the app with the following command:

    node app.js

Then, load `http://localhost:3000/` in a browser to see the output.

# Express application generator

Use the application generator tool, `express-generator`, to quickly create an application skeleton.</br>
You can run the application generator with the npx command.</br>

    npx express-generator

For earlier Node versions, install the application generator as a global npm package and then launch it:

    npm install -g express-generator
    express

Display the command option with the -h option

    express -h

For example, the following creates an Express app named `myapp`. The app will be created in a folder `myapp` in the current working directory and the view engine will be set to [Pug](https://pugjs.org/):

    express --view=pug myapp

Then install dependencies:

    cd myapp
    npm install

On MacOs or Linux, run the app with this command:

    DEBUG=myapp:* npm start

On Windows Command Prompt, use this command:

    set DEBUG=:myapp:* & npm start

On Windows PowerShell, use this command

    $env:DEBUG='myapp:*'; npm start

Then load `http://localhost:3000/` in your browser to access the app.</br>
The generated app has the following directory structure:

    .
    ├── app.js
    ├── bin
    │   └── www
    ├── package.json
    ├── public
    │   ├── images
    │   ├── javascripts
    │   └── stylesheets
    │       └── style.css
    ├── routes
    │   ├── index.js
    │   └── users.js
    └── views
        ├── error.pug
        ├── index.pug
        └── layout.pug

    7 directories, 9 files


# Basic routing

***Routing*** refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).</br>

Each route can have one or more handler functions, which are executed when the route is matched.</br>

Route definition takes the following structure:</br>

    app.METHOD(PATH, HANDLER)

Where:</br>
* **app** is a instance of **express**
* **METHOD** is an HTTP request method, in lowercase.
* **PATH** is a path on the server.
* **HANDLER** is the function executed when the route is matched.

The following examples illustrate defining simple routes.</br>
Respond with **Hello World!** on the homepage.

    app.get('/', (req, res) => {
        res.send('Hello world!)
    })

Respond to POST request on the root route (/), the application's home page:

    app.post('/', (req, res) => {
        res.send('Got a POST request')
    })

Respond to a PUT request to the **/user** route

    app.put('/user', (req, res) => {
        res.send('Got a PUT request at /user')
    })

Respond to a DELETE request to the **/user** route:

    app.delete('/user', (req, res) => {
        res.send('Got a DELETE request at /user')
    })

# Serving static files in Express

To serve static files such as images, CSS files, and JavaScript files, use the **express.static** built-in middleware function in Express.</br>
The function signature is:

    express.static(root, [options])

The **root** argument specifies the root directory from which to serve static assets. For mor information on the **options** argument, see [express.static](https://expressjs.com/en/4x/api.html#express.static).</br>

For example, use the following code to serve images, CSS files, and JavaScript files in a directory named **public**:

    app.use(express.static('public'))

Now, you can load the files that are in the **public** directory:

    http://localhost:3000/images/kitten.jpg
    http://localhost:3000/css/style.css
    http://localhost:3000/js/app.js
    http://localhost:3000/images/bg.png
    http://localhost:3000/hello.html

> Express looks up the files relative to the static directory, so the name of the static directory is not part of the URL.

To use multiple static assets directories, call the **express.static** middleware function multiple times:

    app.use(express.static('public'))
    app.use(express.static('files'))

Express looks up the files in the order in which you set the static directories with the **express.static** middleware function.</br>

> NOTE: For best results, [user a reverse proxy](https://expressjs.com/en/advanced/best-practice-performance.html#use-a-reverse-proxy) cache to improve performance of serving static assets.

To create a virtual path prefix (where the path does not actually exist in the file system) for files that are served by the **express.static** function, [specify a mount path](https://expressjs.com/en/4x/api.html#app.use) for the static directory, as shown below:

    app.use('/static', express.static('public'))

Now, you can load the files that are in the **public** directory from the **/static** path prefix.

    http://localhost:3000/static/images/kitten.jpg
    http://localhost:3000/static/css/style.css
    http://localhost:3000/static/js/app.js
    http://localhost:3000/static/images/bg.png
    http://localhost:3000/static/hello.html

However, the path that you provide to the **express.static** function is relative to the directory form where you launch your node process. If you run express app from another directory, it's safer to use the absolute path of the directory that you want to serve:

    const path = require('path')
    app.use('/static', express.static(path.join(__dirname, 'public')))

For more details about the **serve-static** function and its options, see [serve-static](https://expressjs.com/resources/middleware/serve-static.html)