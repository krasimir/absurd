describe("Adding raw data", function() {

	var Absurd = require('../../index.js'),
		comment = "AbsurdJS is awesome!";

	it("should send raw data", function(done) {
		Absurd(function(api) {
			api
			.add({
				body: {
					marginTop: "20px"
				}
			})
			.raw('/* ' + comment + ' */')
			.add({
				a: {
					paddingTop: "20px"
				}
			})
			.raw('/* end of styles */');
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  margin-top: 20px;\n}\n/* " + comment + " */\na {\n  padding-top: 20px;\n}\n/* end of styles */\n");
			done();
		});		
	});

});
describe("API(add)", function() {

	var Absurd = require('../../index.js');

	it("should use add", function(done) {
		Absurd(function(A) {
			A.add({
				'.absurd-title': {
					'border-radius': '10px'
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain(".absurd-title");
			expect(css).toContain("border-radius: 10px");
			done();
		});		
	});

});
describe("Avoid quoting of properties", function() {

	var Absurd = require('../../index.js');

	it("passing properties", function(done) {
		Absurd(function(api) {
			api.add({
				body: {
					paddingTop: "2px",
					WebkitTransform: "rotate(7deg)",
					fontWeight: "bold",
					"margin-top": "1px",
					".headerNavigation": {
						ABCDEFGHIJKLMNOPQRSTUVWXYZ: "20px"
					}
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  padding-top: 2px;\n  -webkit-transform: rotate(7deg);\n  font-weight: bold;\n  margin-top: 1px;\n}\nbody .headerNavigation {\n  -a-b-c-d-e-f-g-h-i-j-k-l-m-n-o-p-q-r-s-t-u-v-w-x-y-z: 20px;\n}\n");
			done();
		});	
	});

});
describe("API(colors)", function() {

	var Absurd = require('../../index.js');

	it("should use darken", function(done) {
		Absurd(function(api) {
			api.add({
				body: {
					'color': api.darken('#BADA55', 25),
					'background': api.lighten('#BADA55', 25)
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain("color: #8ca440;");
			expect(css).toContain("background: #e9ff6a;");
			done();
		});		
	});

});
describe("Hooks", function() {

	var Absurd = require('../../index.js');

	it("Adding hook (add method)", function(done) {
		Absurd(function(api) {
			api.hook("add", function(rules, stylesheet) {
				expect(rules).toBeDefined();
				expect(stylesheet).not.toBeDefined();
				expect(rules.body).toBeDefined();
				expect(rules.body.fontSize).toBeDefined();
				expect(rules.body.fontSize).toBe("20px");
			}).add({
				body: {
					fontSize: "20px"
				}
			}).compile(function(err, css) {
				expect(css).toBe("body {\n  font-size: 20px;\n}\n");
				done();
			})
		});
	});

	it("Prevent default", function(done) {
		Absurd(function(api) {
			api.hook("add", function(rules, stylesheet) {
				return true;
			}).add({
				body: {
					fontSize: "20px"
				}
			}).compile(function(err, css) {
				expect(css).toBe("");
				done();
			})
		});
	});

	it("Adding hook (import method)", function(done) {
		Absurd(function(api) {
			api.hook("import", function(file) {
				if(file === "body-styles.bla") {
					api.add({
						body: {
							fontSize: "11.5px"
						}
					});
				}
			}).add({
				body: {
					fontSize: "20px"
				}
			}).import("body-styles.bla").compile(function(err, css) {
				expect(css).toBe("body {\n  font-size: 11.5px;\n}\n");
				done();
			})
		});
	});

	it("Adding hook (compile method)", function(done) {
		Absurd(function(api) {
			api.hook("compile", function(callback, options) {
				callback(null, "AbsurdJS is awesome!")
				return true;
			}).add({
				body: {
					fontSize: "20px"
				}
			}).import("body-styles.bla").compile(function(err, css) {
				expect(css).toBe("AbsurdJS is awesome!");
				done();
			})
		});
	});

});
describe("Media queries", function() {

	var Absurd = require('../../index.js');

	it("Media queries", function(done) {
		Absurd(function(api) {
			api.plugin("brand-color", function(api) {
				return { color: '#9fA' };
			})
			api.add({
				body: {
					'line-height': '20px',
					'@media all (max-width: 950px)': {
						'line-height': '40px',
						color: '#BADA55'
					},
					'@media all (min-width: 550px)': {
						'line-height': '32px'
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
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain("body {\n  line-height: 20px;\n}\nbody p {\n  margin: 10px;\n  padding: 4px;\n}\n@media all (max-width: 950px) {\nbody {\n  line-height: 40px;\n  color: #BADA55;\n}\nbody p {\n  color: #9fA;\n  padding: 12px;\n}\n}\n@media all (min-width: 550px) {\nbody {\n  line-height: 32px;\n}\n}\n");
			done();
		});		
	});

});
describe("Using mixins", function() {

	var Absurd = require("../../index.js");

	it("should use a mixin", function(done) {

		var absurd = Absurd();

		absurd.storage("button", function(color, thickness) {
			return {
				color: color,
				display: "inline-block",
				padding: "10px 20px",
				border: "solid " + thickness + "px " + color,
				'font-size': "10px"
			}
		});

		absurd.add({
			'.header-button': [
				absurd.storage("button")("#AAA", 10),
				{
					color: '#F00',
					'font-size': '13px'
				}
			]
		});

		absurd.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain('font-size: 13px;');
			expect(css).toContain('color: #F00;');
			expect(css).not.toContain('color: #AAA;');
			done();
		})

	})

})
describe("Nested selectors", function() {

	var Absurd = require("../../index.js");

	it("should use nesting", function(done) {
		Absurd(function(api) {
			api.add({
				'.content': {
					p: {
						'font-size': '16px',
						'text-shadow': '2px 2px #00F',
						a: {
							'text-decoration': 'none'
						}
					}
				}
				
			})
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain('.content p');
			expect(css).toContain('.content p a');
			done();
		});
	});

});
describe("Optimize CSS", function() {

	var Absurd = require("../../index.js");

	it("should not include empty selectors", function(done) {
		Absurd(function(api){
			api.add({
				body: {
					
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('');
			done();
		});
	});

	it("should add the property only once", function(done) {
		Absurd(function(api){
			api.add({
				body: {
					'font-size': '20px'
				}
			});
			api.add({
				body: {
					'font-size': '30px'
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('body {\n  font-size: 30px;\n}\n');
			done();
		});
	});

	it("should combine selectors", function(done) {
		Absurd(function(api){
			api.add({
				body: {
					'font-size': '20px',
					'padding': '0'
				}
			});
			api.add({
				p: {
					'font-size': '20px',
					'margin': 0,
					'font-weight': 'bold',
					'line-height': '30px',
					'border': 'solid 1px #000'
				}
			});
			api.add({
				a: {
					'padding': '0 0 10px 0',
					'margin': 0,
					'border': 'solid 1px #000'
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain('body, p {\n  font-size: 20px;\n}\n');
			expect(css).toContain('p, a {\n  margin: 0;\n  border: solid 1px #000;\n}\n');
			done();
		});
	});

	it("should combine properties", function(done) {
		Absurd(function(api){
			api.add({
				body: {
					'font-size': '20px'
				}
			});
			api.add({
				body: {
					'padding': '30px'
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('body {\n  font-size: 20px;\n  padding: 30px;\n}\n');
			done();
		});
	});

});
describe("Extending", function() {

	var Absurd = require('../../index.js');

	it("should create plugins", function(done) {
		Absurd(function(api) {
			api.plugin('my-custom-gradient', function(api, colors) {
				return {
					background: 'linear-gradient(to bottom, ' + colors.join(", ") + ')'
				};
			});
			api.plugin('brand-font-size', function(api, type) {
				switch(type) {
					case "small": return { 'font-size': '12px'}; break;
					case "medium": return { 'font-size': '22px'}; break;
					case "big": return { 'font-size': '32px'}; break;
					default: return { 'font-size': '12px'}; break;
				}
			});
			api.add({
				body: {
					margin: '20px',
					'font-size': '14px',
					'my-custom-gradient': ['#F00', '#00F'],
					p: {
						'brand-font-size': 'big'	
					}					
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('body {\n  margin: 20px;\n  font-size: 14px;\n  background: linear-gradient(to bottom, #F00, #00F);\n}\nbody p {\n  font-size: 32px;\n}\n');
			done();
		});		
	});

	it("should create plugin which depends on other plugin", function(done) {
		Absurd(function(api) {
			api.plugin('my-custom-gradient', function(api, colors) {
				return {
					background: 'linear-gradient(to bottom, ' + colors.join(", ") + ')',
					'brand-font-size': 'small'
				};
			});
			api.plugin('brand-font-size', function(api, type) {
				switch(type) {
					case "small": return { 'font-size': '12.5px', 'brand-color': ''}; break;
					case "medium": return { 'font-size': '22px', 'brand-color': ''}; break;
					case "big": return { 'font-size': '32px', 'brand-color': ''}; break;
					default: return { 'font-size': '12px', 'brand-color': ''}; break;
				}
			});
			api.plugin('brand-color', function(api) {
				return { color: '#09f' };
			})
			api.add({
				body: {
					margin: '20px',
					color: '#FAA',
					'font-size': '14px',
					'my-custom-gradient': ['#F00', '#00F']
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('body {\n  margin: 20px;\n  color: #09f;\n  font-size: 12.5px;\n  background: linear-gradient(to bottom, #F00, #00F);\n}\n');
			done();
		});	
	});

});
describe("Shoud prevent camel case transformation", function() {

	it("should import files", function(done) {
		var api = require("../../index.js")();
		api.add({
			body: {
				lineHeight: "20px"
			}
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  lineHeight: 20px;\n}\n");
			done();
		}, { keepCamelCase: true })
	});

});
describe("Pseudo classes", function() {

	var Absurd = require("../../index.js");

	it("should use pseudo classes", function(done) {
		Absurd(function(A) {
			A.add({
				a: {
					'text-decoration': 'none',
					'color': '#000',
					':hover': {
						'text-decoration': 'underline',
						'color': '#999'
					},
					':before': {
						content: '"> "'
					}
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain('a:hover {');
			expect(css).toContain('a:before {');
			done();
		});
	});

});
describe("Register api method", function() {

	var Absurd = require('../../index.js');

	it("should register toJSON API method", function(done) {
		Absurd(function(api) {
			api.register("toJSON", function(callback) {
				api.compile(
					callback, 
					{ 
						processor: function(rules, callback) {
							var filterRules = function(r) {
								for(var prop in r) {
									if(typeof r[prop] === "object") {
										filterRules(r[prop]);
									} else if(r[prop] === false) {
										delete r[prop];
									}
								}
							}
							filterRules(rules)
							callback(null, rules);
						}
					}
				);
			}).add({
				section: {
					margin: 0,
					padding: "20px",
					a: {
						padding: "20px"
					}
				}
			}).toJSON(function(err, json) {
				expect(json).toBeDefined();
				expect(err).toBe(null);
				expect(typeof json).toBe("object");
				expect(json.mainstream.section.padding).toBe("20px");
				done();
			})
		});
	});

});
describe("Using functions inside the json file", function() {

	var Absurd = require("../../index.js");

	it("should not include empty selectors", function(done) {
		Absurd(function(api){
			api.add({
				body: {
					p: {
						fontSize: function() {
							return "10px"
						}
					}
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body p {\n  font-size: 10px;\n}\n")
			done();
		});
	});

});
describe("Fixing allow empty values - ", function() {

	var Absurd = require('../../index.js');

	it("should use empty value", function(done) {
		Absurd(function(api) {
			api.add({
				section: {
					":after": {
						content: ""
					}
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("section:after {\n  content: \"\";\n}\n");
			done();
		});		
	});

});
describe("Fixing bug in array usage", function() {

	var Absurd = require('../../index.js');
	var themeColor = "#BADA55";
	var textStyles = function(size) {
		return {
			color: themeColor,
			fontSize: size + "px",
			lineHeight: size + "px"
		}
	}

	it("should use array", function(done) {
		Absurd(function(api) {
			api.add({
				body: {
					color: themeColor,
					p: textStyles(16),
					h1: [
						textStyles(50),
						{
							lineHeight: "60px"
						} 
					]
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body, body p, body h1 {\n  color: #BADA55;\n}\nbody p {\n  font-size: 16px;\n  line-height: 16px;\n}\nbody h1 {\n  font-size: 50px;\n  line-height: 60px;\n}\n");
			done();
		});		
	});

});
describe("Fixing bug in array usage", function() {

	var Absurd = require('../../index.js');

	it("should use array", function(done) {
		Absurd(function(api) {
			api.plugin("hoverEffect", function(api, color) {
				return {
					":hover": {
						color: color
					}
				}
			})
			api.add({
				a: {
					color: "#000",
					hoverEffect: "#999"
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("a {\n  color: #000;\n}\na:hover {\n  color: #999;\n}\n");
			done();
		});		
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	api.morph("html");

	it("should compile nested tags", function(done) {
		var headTags = [
			{ title: "page title" },
			{ style: {} }
		];
		api.add({
			html: {
				head: headTags,
				body: {}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html>\n<head>\n<title>\npage title\n</title>\n<style/>\n</head>\n<body/>\n</html>');
			done();
		});
	});

	it("should compile list", function(done) {
		var getList = function(data) {
			var list = { ul: [] };
			for(var i=0; item=data[i]; i++) {
				list.ul.push({ li:item });
			}
			return list;
		}
		api.add({
			html: {
				body: getList(["A", "B", "C", "D"])
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html>\n<body>\n<ul>\n<li>\nA\n</li>\n<li>\nB\n</li>\n<li>\nC\n</li>\n<li>\nD\n</li>\n</ul>\n</body>\n</html>');
			done();
		});
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	api.morph("html");

	it("complex html", function(done) {
		api.add({
			_:'<!DOCTYPE html>',
			html: {
				head: {
					title: "html page",
					meta: {
						_attrs: {
							httpEquiv: "Content-Type",
							content: "text/html; charset=utf-8"
						}
					}
				},
				body: {
					_attrs: { class: "home-page" },
					section: {
						h1: "that's html page"
					}
				}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<!DOCTYPE html>\n\
<html>\n\
<head>\n\
<title>\n\
html page\n\
</title>\n\
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>\n\
</head>\n\
<body class="home-page">\n\
<section>\n\
<h1>\n\
that\'s html page\n\
</h1>\n\
</section>\n\
</body>\n\
</html>');
			done();
		});
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	api.morph("html");

	it("complex html", function(done) {
		var inputField = function(name, defaultValue) {
			return {
				input: {
					_attrs: {
						type: "text",
						placeholder: defaultValue,
						name: name
					}
				}
			}
		}
		var submit = function(value) {
			return {
				input: {
					_attrs: {
						type: "submit",
						value: value || "submit the data"
					}
				}
			}
		}
		api.add({
			html: {
				head: {
					title: "html page"
				},
				body: {
					form: [
						{ _: "<label>Please fill the form</label>"},
						inputField("username", "Please type your username"),
						inputField("email", "Please type your email"),
						submit
					]
				}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html>\n\
<head>\n\
<title>\n\
html page\n\
</title>\n\
</head>\n\
<body>\n\
<form>\n\
<label>Please fill the form</label>\n\
<input type="text" placeholder="Please type your username" name="username"/>\n\
<input type="text" placeholder="Please type your email" name="email"/>\n\
<input type="submit" value="submit the data"/>\n\
</form>\n\
</body>\n\
</html>');
			done();
		});
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	api.morph("html");

	it("should use function", function(done) {
		var getTitleTag = function(value) {
			return {
				title: value
			}
		}
		var bodyContent = function() {
			return {
				p: "text"
			}
		}
		api.add({
			html: {
				head: getTitleTag("Absurd is awesome"),
				body: bodyContent
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html>\n<head>\n<title>\nAbsurd is awesome\n</title>\n</head>\n<body>\n<p>\ntext\n</p>\n</body>\n</html>');
			done();
		});
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	api.morph("html");

	it("should compile an empty tag", function(done) {
		api.add({
			body: {}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body/>');
			done();
		});
	});

	it("should compile tag with text inside", function(done) {
		api.add({
			body: "page text"
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body>\npage text\n</body>');
			done();
		});
	});

	it("should compile tag with attributes", function(done) {
		api.add({
			body: {
				_attrs: { class: "black" }
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body class="black"/>');
			done();
		});
	});

	it("should compile tag with attributes and text inside", function(done) {
		api.add({
			body: {
				_attrs: { class: "black" },
				_: "page text"
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body class="black">\npage text\n</body>');
			done();
		});
	});

	it("should compile tag with attributes, text inside and nested tag", function(done) {
		api.add({
			body: {
				_attrs: { class: "black" },
				_: "page text",
				p: "paragraph text"
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body class="black">\npage text\n<p>\nparagraph text\n</p>\n</body>');
			done();
		});
	});

	it("should compile raw content", function(done) {
		api.add({
			_: '<html></html>'
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html></html>');
			done();
		});
	});	

	it("should compile nested tags", function(done) {
		api.add({
			html: {
				head: {
					title: "title"
				},
				body: {}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html>\n<head>\n<title>\ntitle\n</title>\n</head>\n<body/>\n</html>');
			done();
		});
	});

	it("should compile raw content + nested tag", function(done) {
		api.add({
			body: {
				p: {
					_: "That's my text",
					a: {
						_: "read more",
						_attrs: { href: "#"}
					}
				}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body>\n\
<p>\n\
That\'s my text\n\
<a href="#">\n\
read more\n\
</a>\n\
</p>\n\
</body>');
			done();
		});
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	api.morph("html");

	it("should use templates", function(done) {

		api.add({
			title: "AbsurdJS preprocessor"
		}, "title");

		api.add({
			a: {
				_: "link",
				_attrs: {
					href: "#",
					target: "_blank"
				}
			}
		}, "link");

		api.add({
			footer: {
				_: "footer text"
			}
		}, "footer");

		api.add({
			html: {
				head: {
					_tpl: "title"
				},
				body: {
					_: "<h1>oh yeah</h1>",
					_tpl: ["link", "footer"]
				}
			}
		})

		api.compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html>\n\
<head>\n\
<title>\n\
AbsurdJS preprocessor\n\
</title>\n\
</head>\n\
<body>\n\
<h1>oh yeah</h1>\n\
<a href="#" target="_blank">\n\
link\n\
</a>\n\
<footer>\n\
footer text\n\
</footer>\n\
</body>\n\
</html>');
			done();
		});
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	api.morph("html");

	it("should use classes", function(done) {
		var tags = {
			"div.content": {
				p: "text"
			}
		}
		api.add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content">\n<p>\ntext\n</p>\n</div>');
			done();
		});
	});

	it("should use two classes", function(done) {
		var tags = {
			"div.content.left": {
				p: "text"
			}
		}
		api.add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left">\n<p>\ntext\n</p>\n</div>');
			done();
		});
	});

	it("should use id", function(done) {
		var tags = {
			"div#content": {
				p: "text"
			}
		}
		api.add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div id="content">\n<p>\ntext\n</p>\n</div>');
			done();
		});
	});

	it("should use id and class together", function(done) {
		var tags = {
			"div.content#home.left": {
				p: "text"
			}
		}
		api.add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left" id="home">\n<p>\ntext\n</p>\n</div>');
			done();
		});
	});

	it("should use without tag name", function(done) {
		var tags = {
			".content#home.left": {
				p: "text"
			}
		}
		api.add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left" id="home">\n<p>\ntext\n</p>\n</div>');
			done();
		});
	});

	it("should pass attributes", function(done) {
		var tags = {
			'.content[data-behaviour="clickable" title="test" style="position: absolute; top: 20px; left: 30px;"]#home': {
				'img[alt="that\'s my image" some__data="1"]': {}
			}
		}
		api.add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content" id="home" data-behaviour="clickable" title="test" style="position: absolute; top: 20px; left: 30px;">\n<img alt="that\'s my image" some__data="1"/>\n</div>');
			done();
		});
	});

	it("should pass attributes", function(done) {
		var tags = {
			'.content.left#wrapper': {
				'a[href="http://krasimir.github.io/absurd/"]': "AbsurdJS documentation",
				'p.text[title="description" data-type="selectable"]': "CSS preprocessor"
			}
		}
		api.add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left" id="wrapper">\n\
<a href="http://krasimir.github.io/absurd/">\n\
AbsurdJS documentation\n\
</a>\n\
<p class="text" title="description" data-type="selectable">\n\
CSS preprocessor\n\
</p>\n\
</div>');
			done();
		});
	});

});