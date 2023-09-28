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