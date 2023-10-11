# Using template engines with Express

A ***template engine*** enables you to use static template files in your application. At runtime, the template engine replaces variables in a template file with actual values, and transforms the template into an HTML file sent to the client. This approach makes it easier to design an HTML page.</br>

Some popular template engines that work with Express are [Pug](https://pugjs.org/api/getting-started.html), [Mustache](https://www.npmjs.com/package/mustache), and [Ejs](https://www.npmjs.com/package/ejs). The [Express application generator](https://expressjs.com/en/starter/generator.html) uses [Jade](https://www.npmjs.com/package/jade) as its default, but it also supports several others.</br>

See [Template Engines (Express wiki)](https://github.com/expressjs/express/wiki#template-engines) for a list of template engines you can use with Express. See also [Comparing JavaScript Templating Engines: Jade, Mustache, Dust and More](https://strongloop.com/strongblog/compare-javascript-templates-jade-mustache-dust/).

> **NOTE**: Jade has been renamed to Pug. You can continue to use Jade in you app, and it will work just fine. However if you want the latest updates to the template engine, you must replace Jade with Pug in your app.

To render template files, set the following [application setting properties](https://expressjs.com/en/4x/api.html#app.set), set in **app.js** in the default app created by the generator:</br>

* **views**, the directory where the template files are located. Eg: **app.set('views', './views')**. This defaults to the **views** directory in the application root directory.
* **view engine**, the template engine to use. For example, to use the Pug template engine: **app.set('view engine', 'pug')**.

Then install the corresponding template engine npm package; for example to install Pug:</br>

`npm install pug --save`

> Express-compliant template engines such as Jade and Pug export a function named **__express(filePath, options, callback)**, which is called by the **res.render()** function to render the template code.</br>
> Some template engines do not follow this convention. The [Consolidate.js](https://www.npmjs.org/package/consolidate) library follows this convention by mapping all of the popular Node.js template engines, and therefore works seamlessly within Express.

Create a Pug template file named **index.pug** in the **views** directory, with the following content:

    html
      head
        title= title
      body
        h1= message

Then create a route to render the **index.pug** file. If the **view engine** property is not set, you must specify the extension of the **view** file. Otherwise, you can omit it.

    app.get('/', (req, res) => {
      res.render('index', {title: 'Hey', message: 'Hello there!'})
    })

When you make a request to the home page, the **index.pug** file will be render as HTML.</br>

Note: The view engine cache does not cache the contents of the template's output, only the underlying template itself. the view is still re-render with every request even when the cache is on.</br>

To learn more about how template engines work in Express, see: ["Developing template engines for Express"](https://expressjs.com/en/advanced/developing-template-engines.html).