absurd
======

Writing your CSS in JavaScript. That's it!

---

## Installation

	npm install -g absurd

---

## Usage

Absurd is really simple. It just gets instructions and base on them produces css. So, it's just a matter of personal choice where to use it. You may want to integrate the module directly into your application. If that's not ok for you then you are able to compile the css by using the command line.

### Inline styles

	var Absurd = require("absurd");
	Absurd(function(A) {
		A.add({
			body: {
				'margin-top': '20px',
				'padding': 0,
				'font-weight': 'bold',
				section: {
					'padding-top': '20px'
				}
			}
		});
	}).compile(function(err, css) {
		/* 
			css contains:

			body {
				margin-top: 20px;
				padding: 0;
				font-weight: bold;
			}
			body section {
				padding-top: 20px;
			}

		*/
	});

### Puting the styles in an external file

*/css/styles.js*

	module.exports = function(A) {
		A.add({
			body: {
				'margin-top': '20px',
				'padding': 0,
				'font-weight': 'bold',
				section: {
					'padding-top': '20px'
				}
			}
		});
	}

*/app.js*

	Absurd("./css/styles.js").compile(function(err, css) {
		// ...
	});

### Compiling to file

	Absurd("./css/styles.js").compileFile("./css/styles.css", function(err, css) {
		// ...
	});

### Using through command line interface

	absurd -s [source file] <- outputs the css in the console
	absurd -s [source file] -o [output file] <- outputs the css to a file

---

## Syntax