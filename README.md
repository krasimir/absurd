# absurd.js

### Writing your CSS in JavaScript. That's it!

For AbsurdJS, the following code is valid CSS:

	".navigation": {
		margin: "12px 0 0 0 ",
		type: "horizontal",
		a: {
			elementstyle: "button",
			responsive: "true"
		}
	}

*type*, *elementstyle* and *responsive* are just [plugins](https://github.com/krasimir/absurd#plugins) which return pure CSS.

======

  - [Installation](#installation)
  - [Usage](#usage)
  - [Syntax](#syntax)
  - [API](#api)
  - [Testing](#testing)
  - Resources
  	- In-depth article about AbsurdJS - [link](http://davidwalsh.name/write-css-javascript)

======

## Installation

	npm install -g absurd

## Usage

Absurd is really simple. It just gets instructions and base on them produces css. So, it's just a matter of personal choice where to use it. You may want to integrate the module directly into your application. If that's not ok for you then you are able to compile the css by using the command line.

### Compilation

	compile([callback], [settings])
	compileFile([outputFile], [callback], [settings])

*settings* parameter is optional. Valid options:

	{
		combineSelectors: true | false (by default true),
		minify: true | false (by default false)
	}

#### Inline

	var Absurd = require("absurd");
	Absurd(function(api) {
		// use the Absurd's api here
	}).compile(function(err, css) {
		// do something with the css
	},);

Or you may get the API separately.

	var Absurd = require("absurd");
	var absurd = Absurd();
	var api = absurd.api;
	api.add({ ... }).import("...");
	absurd.compile(function(err, css) {
		// do something with the css
	});

#### To file

	var output = "./css/styles.css";
	Absurd("./css/styles.js").compileFile(output, function(err, css) {
		// ...
	});

### Puting the styles in an external file

#### .js

Just create a *.js* file like for example */css/styles.js*. The file should contain the usual nodejs module code.

	module.exports = function(api) {
		// use the Absurd's api here
	}

After that, in your nodejs application */app.js*

	Absurd("./css/styles.js").compile(function(err, css) {
		// ...
	});

#### .json

The library supports importing of pure JSON. Of course this approach doesn't give you an access to the API, but it is still useful if you want to skip the typical Nodejs module definition. For example:

	// styles.json
	{
		"body": {
			"margin": "0",
			"padding": "0",
			"fontSize": "1em",
			"p": {
				"line-height": "30px"
			}
		}
	}

	// app.js
	Absurd("styles.json").compile(function(err, css) {
		// ...
	});

#### .css

Absurd accepts normal CSS. The good news is that you can still use all the other features. For example:

	// styles.js
	api.plugin("size", function(api, type) {
		switch(type) {
			case "large": return { fontSize: "30px" }; break;
			case "medium": return { fontSize: "24px" }; break;
			case "small": return { fontSize: "12px" }; break;
			default: return { fontSize: "16px" };
		}
	});
	api.import(__dirname + "/css/main.css");

	// main.css
	body {
		margin-top: 10px;
		size: small;
	}

And the result is:

	body {
		margin-top: 10px;
		font-size: 12px;
	}

### Using through command line interface

	// Outputs the css in the console.
	absurd -s [source file] 

	// Outputs the css to a file.
	absurd -s [source file] -o [output file]

	// Outputs the css to a file and watching specific directory.
	// If some of the files there is changed a compilation is fired.
	absurd -s [source file] -o [output file] -w [directory]

	// Minify the CSS
	absurd -s [source file] -m true

### Using with Grunt

Dependencies for your *package.json*:

	"dependencies": {
		"grunt": "~0.4.1",
		"grunt-contrib-watch": "*",
		"grunt-absurd": "*"
	}

Simple *Gruntfile.js*:

	module.exports = function(grunt) {

		grunt.initConfig({
			absurd: {
				task: {
					src: __dirname + "/css/absurd/index.js",
					dest: 'css/styles.css'
				}
			},
			watch: {
				css: {
					files: ['css/absurd/**/*.js'],
					tasks: ['absurd']
				}
			}
		});

		grunt.loadNpmTasks('grunt-contrib-watch');
		grunt.loadNpmTasks('grunt-absurd');

		// grunt.registerTask('default', ['concat', 'less']);
		grunt.registerTask('default', ['absurd', 'watch']);

	}

## Syntax

In the context of JavaScript the closest thing to pure CSS syntax is JSON format. So, every valid JSON is actually valid Absurd syntax. As you can see above, there are two ways to send styles to the module. In both cases you have an access to the Absurd's API. For example:

	Absurd(function(api) {
		api.add({});
	});

or in an external js file

	module.exports = function(api) {
		api.add({});
	}

The *add* method accepts valid JSON. This could be something like

	{
		body: {
			marginTop: '20px',
			padding: 0,
			fontWeight: 'bold',
			section: {
				paddingTop: '20px'
			}
		}
	}

Every object defines a selector. Every property of that object could be a property and its value or another object. For example the JSON above is compiled to:

	body {
		margin-top: 20px;
		padding: 0;
		font-weight: bold;
	}
	body section {
		padding-top: 20px;
	}

Have in mind that you don't need to quote the CSS properties. AbsurdJS converts every uppercase letter to a dash followed by the lowercase version of the letter. I.e.:

	WebkitTransform -> -webkit-transform

You may send even an array of style like that

	{
		'.header nav': [
			{ fontSize: '10px' },
			{ fontSize: '20px' }
		]
	}

And that's compiled to

	.header nav {
		font-size: 20px;
	}


### Pseudo classes

It's similar like the example above:

	a: {
		textDecoration: 'none',
		color: '#000',
		':hover': {
			textDecoration: 'underline',
			color: '#999'
		},
		':before': {
			content: '"> "'
		}
	}

Is compiled to:

	a {
		text-decoration: none;
		color: #000;
	}
	a:hover {
		text-decoration: underline;
		color: #999;
	}
	a:before {
		content: "> ";
	}

### Importing

Of course you can't put everything in a single file. That's why there is *.import* method:

	/css/index.js

	module.exports = function(api) {
		api.import(__dirname + '/config/colors.js');
		api.import(__dirname + '/config/sizes.js');
		api.import([
			__dirname + '/layout/grid.json'
		]);
		api.import([
			__dirname + '/forms/login-form.css',
			__dirname + '/forms/feedback-form.css'
		]);
	}

Pay attention to the type of the files. The first two are actually JavaScript files, because they need an access to the API (to define mixins, plugins etc ...). The second *import* statement adds the actual styling. Of course it is not necessary to use this approach, but writing pure JSON sometimes may be a better option.

### Using variables

There is no need to use something special. Because that's pure javascript you may write:

	var brandColor = "#00F";
	Absurd(function(api) {
		api.add({
			'.header nav': {
				color: brandColor
			}
		})
	})

However, if you want to share variables between the files you may use the API's method *storage*. Let's say that you have two files */css/A.js* and */css/B.js* and you want to share values between them.

	// A.js
	module.exports = function(api) {
		api.storage("brandColor", "#00F");
	}

	// B.js
	module.exports = function(api) {
		api.add({
			body: {
				color: api.storage("brandColor")
			}
		})
	}

### Mixins

In the context of Absurd mixins are actually normal javascript functions. The ability to put things inside the Absurd's storage gives you also the power to share mixins between the files. For example:

	// A.js
	module.exports = function(api) {
		api.storage("button", function(color, thickness) {
			return {
				color: color,
				display: "inline-block",
				padding: "10px 20px",
				border: "solid " + thickness + "px " + color,
				fontSize: "10px"
			}
		});
	}

	// B.js
	module.exports = function(api) {
		api.add({
			'.header-button': [
				api.storage("button")("#AAA", 10),
				{
					color: '#F00',
					fontSize: '13px'
				}
			]
		});
	}

What you do is to send array of two objects to the selector '.header-button'. The above code is compiled to:

	.header-button {
		color: #F00;
		display: inline-block;
		padding: 10px 20px;
		border: solid 10px #AAA;
		font-size: 13px;
	}

Notice that the second object overwrites few styles passed via the mixin.

### Plugins (i.e. define your own CSS properties)

The plugins are similar like mixins, but act as property-value pair. There is an API method for registering plugins. For example:

	api.plugin('my-custom-gradient', function(api, colors) {
		return {
			background: 'linear-gradient(to bottom, ' + colors.join(", ") + ')'
		};
	});
	api.plugin('brand-font-size', function(api, type) {
		switch(type) {
			case "small": return { fontSize: '12px'}; break;
			case "medium": return { fontSize: '22px'}; break;
			case "big": return { fontSize: '32px'}; break;
			default: return { fontSize: '12px'}; break;
		}
	});

The code creates two plugins, which respond on *my-custom-gradient* and *brand-font-size* property. So, the following styles

	api.add({
		body: {
			margin: '20px',
			fontSize: '14px',
			'my-custom-gradient': ['#F00', '#00F'],
			p: {
				'brand-font-size': 'big'	
			}					
		}
	});

Are compiled to:

	body {
		margin: 20px;
		font-size: 14px;
		background: linear-gradient(to bottom, #F00, #00F);
	}
	body p {
		font-size: 32px;
	}

Have in mind, that the plugin should always return an object.

### Media queries

The following code

	api.add({
		body: {
			lineHeight: '20px',
			'@media all (max-width: 950px)': {
				lineHeight: '40px',
				color: '#BADA55'
			},
			'@media all (min-width: 550px)': {
				lineHeight: '32px'	
			},
			p: {
				margin: '10px',
				padding: '4px',
				'@media all (max-width: 950px)': {
					padding: '12px',
					'brand-color': ''
				}
			}
		}
	});

is compiled to

	body {
		line-height: 20px;
	}
	body p {
		margin: 10px;
		padding: 4px;
	}
	@media all (max-width: 950px) {
		body {
			line-height: 40px;
			color: #BADA55;
		}
		body p {
			color: #9fA;
			padding: 12px;
		}
	}
	@media all (min-width: 550px) {
		body {
			line-height: 32px;
		}
	}

### Sending raw data to the final compiled CSS

AbsurdJS gives you ability to directly send content to the final CSS. I.e. something which is skipped by the compiler and it is directly concatenated with the processed data.

	api
	.add({
		body: {
			marginTop: "20px",
			p: {
				fontSize: "5px"
			}
		}
	})
	.raw('/* ' + comment + ' */')
	.add({
		a: {
			paddingTop: "20px"
		}
	});

The code above is compiled to

	body {
	  margin-top: 20px;
	}
	body p {
	  font-size: 5px;
	}
	/* AbsurdJS is awesome! */
	a {
	  padding-top: 20px;
	}

## API

### .add([object])

	module.exports = function(api) {
	    api.add({
	    	body: { 
	    		padding: 0 
	    	}
		});
	}

### .import([string] | [[string, string, ...]])

	module.exports = function(A) {
		A.import(__dirname + '/config/sizes.js');
		A.import([
			__dirname + '/config/colors.js',
			__dirname + '/config/sizes.js'
		]);
	}

AbsurdJS supports importing of JavaScript, JSON and CSS files.

### .storage([key], [value])

Setting value:

	module.exports = function(api) {
	    api.storage("mixin", function(px) { 
	    	return {
	    		fontSize: px + 'px'
	    	}
	    });
	}

Getting value:

	module.exports = function(api) {
		api.add({
			body: [
				api.storage("mixin")(18)
			]
		});
	}	

### .plugin([name of property], [function])

	api.plugin('my-custom-gradient', function(api, colors) {
		return {
			background: 'linear-gradient(to bottom, ' + colors.join(", ") + ')'
		};
	});

The function of the plugin accepts two arguments. The first one is a reference to the API and second one is the value of the CSS property.

### .darken([color], [percents])

	module.exports = function(api) {
		api.add({
			body: {
				color: api.darken('#BADA55', 25) // darken 25%
			}
		});
	}

### .lighten([color], [percents])

	module.exports = function(api) {
		api.add({
			body: {
				color: api.lighten('#BADA55', 25) // lighten 25%
			}
		});
	}

### .raw([string])

	module.exports = function(api) {
		api.raw('/* comment here */');
	}

## Testing

The tests are placed in */tests* directory. Install [jasmine-node](https://github.com/mhevery/jasmine-node) and run

	jasmine ./tests