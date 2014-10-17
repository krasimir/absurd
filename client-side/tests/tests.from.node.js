describe("Adding raw data", function() {

	var api = require('../../index.js')()

	it("should send raw data", function(done) {		
		api
		.add({
			body: {
				marginTop: "20px"
			}
		})
		.raw('body { fontSize: 20px; }')
		.add({
			a: {
				paddingTop: "20px"
			}
		})
		.raw('article:after { display: block; }')
		.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body{margin-top: 20px;}body{fontSize: 20px;}a{padding-top: 20px;}article:after{display: block;}");
			done();
		}, {minify: true});		
	});
	
});
describe("Should use import CSS", function() {

	var api = require('../../index.js')();
	var css = '\
	.header {\
		margin: 0;\
		font-size: 20px;\
	}\
	.header p {\
		line-height: 22px;\
	}\
	@media all and (max-width: 460px) {\
		.header p {\
			line-height: 33px;\
			color: #000;\
		}\
	}';

	it("should compile properly", function(done) {
		api
		.importCSS(css)
		.add({ '.header': { mar: '10px 20px' }})
		.add({ '.header p': { color: '#FFF' }})
		.compile(function(err, css) {
			expect(css).toBe('.header{margin: 10px 20px;font-size: 20px;}.header p{line-height: 22px;color: #FFF;}@media all and (max-width: 460px) {.header p{line-height: 33px;color: #000;}}');
			done();
		}, { minify: true });
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
describe("CSS prefixes", function() {

	var api = require('../../index.js')();

	it("should use prefixes", function(done) {
		api.add({
			body: {
				p: {
					marginTop: '1px 0',
					'-border-radius': '10px',
					fontSize: '20px'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body p{margin-top: 1px 0;border-radius: 10px;-webkit-border-radius: 10px;-moz-border-radius: 10px;-ms-border-radius: 10px;-o-border-radius: 10px;font-size: 20px;}');
			done();
		}, { minify: true });
	});

	it("should use only specific prefixes", function(done) {
		api.add({
			body: {
				p: {
					'-wm-border-radius': '10px'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body p{border-radius: 10px;-webkit-border-radius: 10px;-moz-border-radius: 10px;}');
			done();
		}, { minify: true });
	});

	it("should use only one prefix", function(done) {
		api.add({
			body: {
				p: {
					'-s-border-radius': '10px'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body p{border-radius: 10px;-ms-border-radius: 10px;}');
			done();
		}, { minify: true });
	});

	it("should use prefixes with plugin", function(done) {
		api.plugin('awesome', function(api, value, prefix) {	
			var r = {};
			r[prefix + 'borderRadius'] = value + "px";
			return r;
		});
		api.add({
			body: {
				p: {
					'-sw-awesome': 20
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body p{border-radius: 20px;-webkit-border-radius: 20px;-ms-border-radius: 20px;}');
			done();
		}, { minify: true });
	});

});
describe(".define function", function() {

	var api = require('../../index.js')();

	it("should use define to register a variable", function(done) {
		api.flush().define("brand-color", "#BADA55");
		api.add({
			body: {
				color: '<% brand-color %>',
				borderTop: '1px <%brand-color%> dotted'
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{color: #BADA55;border-top: 1px #BADA55 dotted;}');
			done();
		}, { minify: true });
	});

	it("should use define to register a function", function(done) {
		api.flush().define("brand-color", function() {
			return '#BADA55';
		});
		api.add({
			body: {
				color: '<% brand-color %>',
				borderTop: '1px <% brand-color %> dotted'
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{color: #BADA55;border-top: 1px #BADA55 dotted;}');
			done();
		}, { minify: true });
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
			})['import']("body-styles.bla").compile(function(err, css) {
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
			})['import']("body-styles.bla").compile(function(err, css) {
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
			expect(css).toBe('body{line-height: 20px;}body p{margin: 10px;padding: 4px;}@media all (max-width: 950px){body{line-height: 40px;color: #BADA55;}body p{color: #9fA;padding: 12px;}}@media all (min-width: 550px){body{line-height: 32px;}}');
			done();
		}, {minify: true});		
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

	});

	it("should pass multiple values to storage", function(done) {
		var api = Absurd();
		api.storage({
			red: '#FF0000',
			green: '#00FF00',
			blue: '#0000FF',
			darkRed: '#550000',
			uselessMixin: function(v){
				return v;
			}
		});
		api.add({
			body: [
				{ color: api.storage("red") },
				{ background: api.storage("green") },
				api.storage("uselessMixin")({ width: "100%", height: "100%"})
			]
		});
		api.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n\
  color: #FF0000;\n\
  background: #00FF00;\n\
  width: 100%;\n\
  height: 100%;\n\
}\n");
			done();
		})
	});

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
							'text-decoration': 'none',
							span: {
								fontSize: '10px'
							}
						}
					}
				}
				
			})
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain('.content p{font-size: 16px;text-shadow: 2px 2px #00F;}.content p a{text-decoration: none;}.content p a span{font-size: 10px;}');
			done();
		}, {minify: true});
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

	it("keep camel case", function(done) {
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
describe("Prevent combining certain properties", function() {

	var absurd = require("../../index.js")();

	it("should use nesting", function(done) {
		absurd.add({
			body: {
				width: '100px',
				fz: '18px',
				mar: '2px 3px 0 0',
				p: {
					fz: '20px'
				},
				span: {
					d: 'b'
				}
			}
		}).add({
			section: {
				wid: '100px',
				fz: '20px',
				a: {
					pad: '0 0 0 10px',
					fz: '20px',
					d: 'b'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{font-size: 18px;margin: 2px 3px 0 0;}body,section{width: 100px;}body p{font-size: 20px;}body span{display: block;}section{font-size: 20px;}section a{padding: 0 0 0 10px;font-size: 20px;display: block;}');
			done();
		}, {
			minify: true,
			preventCombining: ['font-size', 'display']
		});
	});

	it("should prevent the combining of a selector", function(done) {
		absurd.flush().add({
			'.content': {
				mar: 0,
				fz: '10px'
			}
		});
		absurd.add({
			'.content': {
				pad: 0,
				fz: '20px'
			}
		}, { preventCombining: ['.content'] }).compile(function(err, css) {
			expect(css).toBe('.content{margin: 0;font-size: 10px;}.content{padding: 0;font-size: 20px;}')
			done();
		}, {
			minify: true
		});
	});

	it("should prevent the combining of a @font-size", function(done) {
		absurd.flush().add({
			'@font-face': {
				fontFamily: 'MuseoSans',
				src: "url('/fonts/Museo Sans/MuseoSans_500.otf')", 
			}
		});
		absurd.add({
			'@font-face': {
				fontFamily: 'MuseoSans',
				fontStyle: 'italic, oblique',
				src: "url('/fonts/Museo Sans/MuseoSans_500_italic.otf')"
			}
		}).compile(function(err, css) {
			expect(css).toBe("@font-face{font-family: MuseoSans;src: url('/fonts/Museo Sans/MuseoSans_500.otf');}@font-face{font-family: MuseoSans;font-style: italic,oblique;src: url('/fonts/Museo Sans/MuseoSans_500_italic.otf');}")
			done();
		}, {
			minify: true
		});
	});

	it("should prevent the combining of a @font-size with other classes", function(done) {
		absurd.flush().add({
			'@font-face': {
				fontFamily: 'MuseoSans',
				src: "url('/fonts/Museo Sans/MuseoSans_500.otf')", 
			},
			'.content': {
				fz: '10px'
			}
		}, { preventCombining: ['.content'] });
		absurd.add({
			'@font-face': {
				fontFamily: 'MuseoSans',
				fontStyle: 'italic, oblique',
				src: "url('/fonts/Museo Sans/MuseoSans_500_italic.otf')"
			},
			'.content': {
				fz: '20px'
			}
		}, { preventCombining: ['.content']}).compile(function(err, css) {
			expect(css).toBe("@font-face{font-family: MuseoSans;src: url('/fonts/Museo Sans/MuseoSans_500.otf');}.content{font-size: 10px;}@font-face{font-family: MuseoSans;font-style: italic,oblique;src: url('/fonts/Museo Sans/MuseoSans_500_italic.otf');}.content{font-size: 20px;}")
			done();
		}, {
			minify: true
		});
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
describe("Should return the processed data", function() {

	var api = require('../../index.js')();

	it("should use the compile method", function(done) {
		var result = api.add({
		    body: {
		    	fz: '20px'
		    }
		}).compile(null, { minify: true });
		expect(result).toBe('body{font-size: 20px;}');
		done();
	});

});
describe("Use ampersand operator", function() {

	var api = require('../../index.js')();

	it("should use add", function(done) {
		api.add({
			a: {
				color: 'red',
				':hover': { color: 'blue' },
				'&.fancy': { color: 'green' }
			}
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("a {\n  color: red;\n}\na:hover {\n  color: blue;\n}\na.fancy {\n  color: green;\n}\n");
			done();
		})
	});
	
	it("should replace all ampersand with parent selector", function(done) {
		api.add({
			a: {
				color: 'red',
				':hover': { color: 'blue' },
				'&.fancy': { color: 'green' },
				'.ie6 &:hover, .ie7 &:hover': { color: 'orange' },
				'.ie6 &.fancy': { color: 'yellow' },
				'.ie7 &.fancy': { color: 'black' }
			}
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('a{color: red;}a:hover{color: blue;}a.fancy{color: green;}.ie6 a:hover,.ie7 a:hover{color: orange;}.ie6 a.fancy{color: yellow;}.ie7 a.fancy{color: black;}');
			done();
		}, { minify: true })
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
describe("Using class as property", function() {

	var absurd = require('../../index.js')();

	it("should use classify with toString", function(done) {
		var px = function(wid) {
			var api = {
				classify: true,
				add: function(mar) {
					wid += mar;
					return this;
				},
				toString: function() {
					return wid + 'px';
				}
			}
			return api;
		};
		absurd.add({
			body: {
				width: px(40).add(10)
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{width: 50px;}');
			done();
		}, { minify: true });
	});

	it("should use classify with toJSON", function(done) {
		var size = function(wid) {
			var api = {
				classify: true,
				add: function(mar) {
					wid += mar;
					return this;
				},
				toString: function() {
					return wid + 'px';
				},
				toJSON: function() {
					return {
						wid: wid + 'px'
					}
				}
			}
			return api;
		};
		absurd.add({
			body: {
				p: size(40).add(10)
			}
		}).compile(function(err, css) {
			expect(css).toBe('body p{width: 50px;}');
			done();
		}, { minify: true });
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
describe("Fixing allow null values - ", function() {

	var Absurd = require('../../index.js');

	it("allow null in arrays", function(done) {
		Absurd(function(api) {
			api.add({
				body: {
                    span: [{ width: '3px'}, null, {height: '3px'}]
				}
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body span{width: 3px;height: 3px;}");
			done();
		}, {minify: true});
	});

});
describe("Fixing bug with ampersand inside a plugin", function() {

	var api = require('../../index.js')();

	it("should use remove the ampersand prop", function(done) {
		api.plugin("hoverEffect", function(api, color) {
		    return {
		        "&:hover": {
		            color: color,
		            background: api.lighten(color, 60),
		            ".ie8 &": {
		            	color: "blue"
		            }
		        },
		        ".ie8 &": {
		            color: "#eee"
		        }
		    };
		});
		api.add({
		    a: {
		        color: "#000",
		        hoverEffect: "#999"
		    }
		});
		api.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("a {\n\
  color: #000;\n\
}\n\
a:hover {\n\
  color: #999;\n\
  background: #f5f5f5;\n\
}\n\
.ie8 a:hover {\n\
  color: blue;\n\
}\n\
.ie8 a {\n\
  color: #eee;\n\
}\n");
			done();
		});		
	});

});
describe("Ampersand and nesting", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.add({
			body: {
		        marginTop: "20px",
		        width: "100%",
		        section: {
		        	'&, &:hover, p, .cls4': {
		        		lineHeight: '20px'
		        	}
		        }
		    },
		    header: {
		        width: "100%",
		        '&, .cls2, .cls3': {
		            color: "red"
		        }
		    }
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('body{margin-top: 20px;}body,header{width: 100%;}body section,body section:hover,body section p,body section .cls4{line-height: 20px;}header,header .cls2,header .cls3{color: red;}');
			done();
		}, { minify: true });
	});

});
describe("Appending styles - ", function() {

	var Absurd = require('../../index.js');

	it("should append a style", function(done) {
		Absurd(function(api) {
			api.add({
			    body: {
			        "text-shadow": "0px 0px 3px red",
			        "color": "green"
			    },
			});
			api.add({
			    body: {
			        "text-shadow": "+0px 0px 7px blue"
			    },
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body{text-shadow: 0px 0px 3px red,0px 0px 7px blue;color: green;}");
			done();
		}, {minify: true});		
	});

	it("should allow plus sign in the first selector", function(done) {
		Absurd(function(api) {
			api.add({
			    body: {
			        "text-shadow": "+0px 0px 3px red",
			        "color": "green"
			    }
			});
			api.add({
			    body: {
			        "text-shadow": "+0px 0px 7px blue"
			    }
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body{text-shadow: 0px 0px 3px red,0px 0px 7px blue;color: green;}");
			done();
		}, {minify: true});		
	});

	it("should allow plus sign in the first selector only", function(done) {
		Absurd(function(api) {
			api.add({
			    body: {
			        "text-shadow": "+0px 0px 3px red",
			        "color": "green"
			    }
			});
			api.add({
			    body: {
			        "text-shadow": "0px 0px 7px blue"
			    }
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body{text-shadow: 0px 0px 7px blue;color: green;}");
			done();
		}, {minify: true});		
	});

	it("should append with an interval", function(done) {
		Absurd(function(api) {
			api.add({
			    body: {
			        "text-shadow": ">0px 0px 3px red",
			        "color": "green"
			    }
			});
			api.add({
			    body: {
			        "text-shadow": ">0px 0px 7px blue"
			    }
			});
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body{text-shadow: 0px 0px 3px red 0px 0px 7px blue;color: green;}");
			done();
		}, {minify: true});		
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
describe("Can't compile atoms and molecules in keyframes", function() {

	var api = require('../../index.js')();

	it("should compile top property", function(done) {
		api.add({
			'-w-keyframes': {
				name: "hide-preloader",
				frames: {
					"0%": { 
						transparent: 1,
						moveto: '0/0'
					},
					"100%": { 
						transparent: 0,
						'-wms-trf': 'translate(0px,-40px)'
					}
				}
			}
		})
		api.compile(function(err, css) {
			expect(css).toBe('@keyframes hide-preloader {0%{filter: alpha(opacity=100);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);opacity: 1;-moz-opacity: 1;-khtml-opacity: 1;transform: translate(0px,0px);-webkit-transform: translate(0px,0px);-ms-transform: translate(0px,0px);}100%{filter: alpha(opacity=0);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);opacity: 0;-moz-opacity: 0;-khtml-opacity: 0;transform: translate(0px,-40px);-webkit-transform: translate(0px,-40px);-moz-transform: translate(0px,-40px);-ms-transform: translate(0px,-40px);}}@-webkit-keyframes hide-preloader {0%{filter: alpha(opacity=100);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);opacity: 1;-moz-opacity: 1;-khtml-opacity: 1;transform: translate(0px,0px);-webkit-transform: translate(0px,0px);-ms-transform: translate(0px,0px);}100%{filter: alpha(opacity=0);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);opacity: 0;-moz-opacity: 0;-khtml-opacity: 0;transform: translate(0px,-40px);-webkit-transform: translate(0px,-40px);-moz-transform: translate(0px,-40px);-ms-transform: translate(0px,-40px);}}');
			done();
		}, {minify: true});
	})

});
describe("Fixing browser prefixes bug - ", function() {

	var Absurd = require('../../index.js');

	it("should compile properly", function(done) {
		Absurd(function(api) {
			api.add({
				header: {
					"animation-name": "test",
					"-moz-animation-name": "test",
					"-webkit-animation-name": "test",
					"-ms-animation-name": "test",
					"-o-animation-name": "test"
			    }
			});
		}).compile(function(err, css) {
			expect(css).toBe('header{animation-name: test;-moz-animation-name: test;-webkit-animation-name: test;-ms-animation-name: test;-o-animation-name: test;}');
			done();
		}, {minify: true});		
	});

});
describe("Can't compile top property", function() {

	var api = require('../../index.js')();

	it("should compile top property", function(done) {
		api.add({
			'header': {
				position: 'absolute',
				top: '100px'
			}
		})
		api.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("header{position: absolute;top: 100px;}");
			done();
		}, {minify: true});
	})

});
describe("Can't compile style with classify property", function() {

	var api = require('../../index.js')();

	it("should compile top property", function(done) {
		var foo = function(x){
		    return {
		        classify: true,
		        toJSON: function(){
		            return{
		                width: 200 + x + 'px'
		            }
		        }
		    };
		};
		api.add({
			'.foo': foo(10)
		})
		api.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBe(".foo{width: 210px;}");
			done();
		}, {minify: true});
	})

});
describe("Wrong output on combineSelectors:false", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		var css = {};
		css['.clearfix'] = {
		  '*zoom': 1,
		  '&:before, &:after': {
		    display: 'table',
		    content: '',
		    lineHeight: 0,
		  },
		  '&:after': {
		    clear: 'both',
		  },
		};
		api.add(css, { combineSelectors: false });
		api.compile(function(err, css) {
			expect(css).toBe('.clearfix{*zoom: 1;}.clearfix:before,.clearfix:after{display: table;content: "";line-height: 0;}.clearfix:after{clear: both;}');
			done();
		}, {minify: true, combineSelectors: false});
	})

});
describe("Should add two @font-face", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.add({
			"@font-face": {
		        fontFamily: "chinese_rocks_rg",
		        src: "url('../fonts/chinese_rocks_rg.woff') format('woff'), url(../fonts/chinese_rocks_rg.ttf) format('truetype')"
		    },
		    "%test%@font-face": {
		        fontFamily: "PENSHURS",
		        src: "url('../fonts/PENSHURS.woff') format('woff'), url(../fonts/PENSHURS.ttf) format('truetype')"
		    }
		}).compile(function(err, css) {
			expect(css).toBe("@font-face{font-family: chinese_rocks_rg;src: url('../fonts/chinese_rocks_rg.woff') format('woff'),url(../fonts/chinese_rocks_rg.ttf) format('truetype');}@font-face{font-family: PENSHURS;src: url('../fonts/PENSHURS.woff') format('woff'),url(../fonts/PENSHURS.ttf) format('truetype');}");
			done();
		}, { minify: true });
	});
	
	it("should compile properly with three font faces", function(done) {
		api.add({
			'%1%@font-face': {
			  'font-family': '\'Titillium\'',
			  src: 'url(\'type/titillium-light-webfont.eot\')',
			  'font-style': 'normal'
			},
			'%2%@font-face': {
			  'font-family': '\'Titillium\'',
			  src: 'url(\'type/titillium-lightitalic-webfont.eot\')',
			  'font-style': 'italic'
			},
			'%3%@font-face': {
			  'font-family': '\'Titillium\'',
			  src: 'url(\'type/titillium-semibold-webfont.eot\')',
			  'font-weight': '600',
			  'font-style': 'normal'
			}
		}).compile(function(err, css) {
			expect(css).toBe("@font-face{font-family: 'Titillium';src: url('type/titillium-light-webfont.eot');font-style: normal;}@font-face{font-family: 'Titillium';src: url('type/titillium-lightitalic-webfont.eot');font-style: italic;}@font-face{font-family: 'Titillium';src: url('type/titillium-semibold-webfont.eot');font-weight: 600;font-style: normal;}");
			done();
		}, { minify: true });
	});

	it("should compile properly with three font faces", function(done) {
		api.add({ 
				'@font-face': {
					'font-family': '\'callunaregular\'',
					src: 'url(\'type/calluna.eot\')',
					'font-weight': 'normal',
					'font-style': 'normal'
				},
				'%0%@font-face': { 
					'font-family': '\'museo_sans100\'',
					src: 'url(\'type/museosans.eot\')',
					'font-weight': 'normal',
					'font-style': 'normal'
				}
		}).compile(function(err, css) {
			expect(css).toBe("@font-face{font-family: 'callunaregular';src: url('type/calluna.eot');font-weight: normal;font-style: normal;}@font-face{font-family: 'museo_sans100';src: url('type/museosans.eot');font-weight: normal;font-style: normal;}");
			done();
		}, { minify: true });
	});

});
describe("Allow usage of keepCamelCase", function() {

	var api = require('../../index.js')();

	it("should use keepCamelCase", function(done) {
		api.morph("html").add({
			testProperty: {
				SomeElement: "text here"
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe("<testProperty><SomeElement>text here</SomeElement></testProperty>");
			done();
		}, {keepCamelCase: true, minify: true});		
	});

});
describe("Using li:a", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.add({
			ul: {
				mar: 0,
				pad: 0,
				lis: 'n',
				li: {
					pad: 0,
					mar: 0,
					a: {

					}
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('ul,ul li{margin: 0;padding: 0;}ul{list-style: none;}');
			done();
		}, { minify: true });
	});

});
describe("Media queries bugs", function() {

	var api = require('../../index.js')();

	it("should compile media queries properly", function(done) {
		api.add({
			'@media screen and (max-width: 767px)': {
		        a: { color:'red', },
		        div: { color:'blue', },
		        '.some-class': { color:'green' }
		    }
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("@media screen and (max-width: 767px){a{color: red;}div{color: blue;}.some-class{color: green;}}");
			done();
		}, { minify: true });
	});

	it("should compile media queries properly", function(done) {
		api.add({
			section: {
				'.widget': {
					fontSize: '20px',
					'@media screen and (max-width: 767px)': {
						fontSize: '30px'
					}
				},
				p: {
					'@media screen and (max-width: 767px)': {
						a: { color: 'red' },
						'@media screen and (max-width: 200px)': {
							span: { lineHeight: '10px' }
						}
					}
				}
			},
			'@media screen and (max-width: 767px)': {
		        a: { color:'red', },
		        div: { color:'blue', },
		        '.some-class': { color:'green' }
		    }
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("section .widget{font-size: 20px;}@media screen and (max-width: 767px){section .widget{font-size: 30px;}section p a,a{color: red;}div{color: blue;}.some-class{color: green;}}@media screen and (max-width: 200px){section p span{line-height: 10px;}}");
			done();
		}, { minify: true });
	});

});
describe("Morph, flush usage /", function() {

	var api = require('../../index.js')();

	it("should compile to css", function(done) {
		api.add({
			body: { margin: "20px" }
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  margin: 20px;\n}\n");
			done();
		});		
	});

	it("should compile to html", function(done) {
		api.morph("html").add({
			body: { p: "text" }
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe("<body><p>text</p></body>");
			done();
		}, { minify: true });		
	});

	it("should compile to css again", function(done) {
		api.add({
			body: { padding: "20px" }
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  padding: 20px;\n}\n");
			done();
		});		
	});

});
describe("Allow nested objects in arrays", function() {

	var api = require('../../index.js')();

	it("use nested objects in array", function(done) {
		api.add({
		    body: [
		    	{ width: '80px' },
		    	{ span: { display: 'inline' } },
		    	{ 
		    		section: {
		    			fontSize: "23px"
		    		},
		    		ul: [
		    			{ margin: "10px" },
		    			{ a: { color: "blue" } },
		    			{ padding: "20px" }
		    		]
		    	}
		    ]
	}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body{width: 80px;}body span{display: inline;}body section{font-size: 23px;}body ul{margin: 10px;padding: 20px;}body ul a{color: blue;}");
			done();
		}, {minify: true});
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
describe("Multiple selectors per rule overwrite all individual selectors", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.add({
			'html, body': { color:'red' },
		    'body': { background:'blue' },
		    'html': { background:'pink' }
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("html,body{color: red;}html{background: pink;}body{background: blue;}");
			done();
		}, { minify: true });
	});

});
describe("Should allow the usage of null param in the HTML morphing", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.morph('html').add({
			'form' : {
			    'input#myId.clas1.clas2': null
			}
		}).compile(function(err, html) {
			expect(html).toBe('<form><input class="clas1 clas2" id="myId"/></form>');
			done();
		}, { minify: true });
	});

	it("should compile properly (diff between null and empty string)", function(done) {
		api.morph('html').add({
			'form' : {
			    'input#myId.clas1.clas2': null,
			    'i.fa.fa-home': ''
			}
		}).compile(function(err, html) {
			expect(html).toBe('<form><input class="clas1 clas2" id="myId"/><i class="fa fa-home"></i></form>');
			done();
		}, { minify: true });
	});

});
describe("Should call animate without holder", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		var styles = {
			animate: ['show', {
				'0%': { color: '#FFF' },
				'100%': { color: '#000' }
			}]
		}
		api.add(styles).compile(function(err, css) {
			expect(css).toBe('@keyframes show {0%{color: #FFF;}100%{color: #000;}}@-webkit-keyframes show {0%{color: #FFF;}100%{color: #000;}}');
			done();
		}, { minify: true });
	});

});
describe("Should not modify the original object", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		var styles = {
			body: {
				p: {
					fontSize: '20px',
					span: {
						display: 'block'
					}
				}
			}
		}
		api.add(styles).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body p{font-size: 20px;}body p span{display: block;}");
			expect(styles.body.p).not.toBe(false);
			done();
		}, { minify: true });
	});

});
describe("Should not print empty selectors", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		var styles = {};
		styles['.system'] = {
			'&:before': {
				position: 'absolute',
				color: 'red',
				content: 'SS',
			},
			'&-shields': {
			}
		};
		api.add(styles).compile(function(err, css) {
			expect(css).toBe('.system:before{position: absolute;color: red;content: SS;}');
			done();
		}, { minify: true });
	});

});
describe("Should skip the processing of null values", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		var styles = {
		    body: {
		        marginTop: null,
		        width: "100%",
		        p: {
		        	span: {
		        		fontSize: '20px',
		        		display: null,
		        		fontWeight: false
		        	}
		        }
		    },
		    header: {
		        width: "100%"
		    }
		}
		api.add(styles).compile(function(err, css) {
			expect(css).toBe('body,header{width: 100%;}body p span{font-size: 20px;}');
			done();
		}, { minify: true });
	});

});
describe("Support comma separated selectors", function() {

	var api = require('../../index.js')();

	it("Support comma separated selectors", function(done) {
		api.add({
			"body, section, h1": {
				padding: "20px",
				"b, i": { fontSize: "20px"}
			}
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body,section,h1{padding: 20px;}body b,body i,section b,section i,h1 b,h1 i{font-size: 20px;}");
			done();
		}, {minify: true});
	});

});
describe("Should skip the processing of null values", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.add({
			'%0%.grandparent .parent .child': {
				color: '#fff'
			}
		}).compile(function(err, css) {
			expect(css).toBe('.grandparent .parent .child{color: #fff;}');
			done();
		}, { minify: true });
	});

});
describe("Using wid atom", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.add({
			header: {
				"-w-width": "100%"
			}
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('header{width: 100%;-webkit-width: 100%;}');
			done();
		}, { minify: true });
	});

});
describe("Wrong handling of Array of Objects in Comma Separated Nested-Selectors", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		// single value
		api.storage("fontsize", "16px");
		// multiple values
		api.storage({
		    color: "red",
		    theme: function(color) {
		        return {
		            color: color,
		            background: api.lighten(color, 50)
		        }
		    }
		});
		api.add({
		    body: {
		        background: api.storage("color"),
		        "section a, section div": [
		            api.storage("theme")("#999"),
		            { marginTop: "20px" },
		            { fontSize: api.storage("fontsize") }
		        ]
		    }
		});
		api.compile(function(err, css) {
			expect(css).toBe('body{background: red;}body section a,body section div{color: #999;background: #e6e6e6;margin-top: 20px;font-size: 16px;}');
			done();
		}, {minify: true})
	});

})
describe("Componenting", function() {

	var api = require('../../../index.js')();

	it("should define component and compile it", function(done) {
		var component = {
			css: {
				"#widget": {
					width: "200px",
					padding: "30px 10px",
					background: "#aaa",
					a: {
						fontSize: "20px",
						textDecoration: "none"
					}
				}
			},
			html: {
				"div[id=\"widget\"]": {
					p: {
						"a[href=\"http://bla.com\"]": "share"
					}
				}
			}
		};
		api.morph("component").add(component).compile(function(err, css, html) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(html).toBeDefined();
			expect(css).toBe('#widget{width: 200px;padding: 30px 10px;background: #aaa;}#widget a{font-size: 20px;text-decoration: none;}')
			expect(html).toBe('<div id="widget"><p><a href="http://bla.com">share</a></p></div>')
			done();
		}, { minify: true });
	});

	it("should use a function instead of object", function(done) {
		var component = function() {
			return {
				css: {
					".login-link": { color: "red"}
				},
				html: {
					'a.login-link': "Please login"
				}
			}
		}
		api.morph("component").add(component).compile(function(err, css, html) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(html).toBeDefined();
			expect(css).toBe(".login-link{color: red;}");
			expect(html).toBe('<a class="login-link">Please login</a>');
			done();
		}, { minify: true })
	});

	it("should compile several components", function(done) {
		var componentA = function() {
			return {
				css: {
					".login-link": { color: "red", fontSize: "16px" }
				},
				html: {
					'a.login-link': "Please login"
				}
			}
		}
		var componentB = function() {
			return {
				css: {
					".logout-link": { color: "red", fontSize: "11px" }
				},
				html: {
					'a.logout-link': "Logout"
				}
			}
		}
		api.morph("component").add([componentA, componentB]).compile(function(err, css, html) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(html).toBeDefined();
			expect(css).toBe(".login-link,.logout-link{color: red;}.login-link{font-size: 16px;}.logout-link{font-size: 11px;}");
			expect(html).toBe('<a class="login-link">Please login</a><a class="logout-link">Logout</a>');
			done();
		}, { minify: true })
	});

});
describe("Componenting", function() {

	var api = require('../../../index.js')();

	it("should define component and compile it with data", function(done) {
		var component = {
			css: {
				"#widget": {
					width: "200px",
					padding: "30px 10px",
					background: "#aaa",
					a: {
						fontSize: "20px",
						textDecoration: "none"
					}
				}
			},
			html: {
				"div[id=\"widget\"]": {
					p: {
						"a[href=\"http://bla.com\"]": "<% this.data.label %>"
					}
				}
			}
		};
		api.morph("component").add(component).compile(function(err, css, html) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(html).toBeDefined();
			expect(css).toBe('#widget{width: 200px;padding: 30px 10px;background: #aaa;}#widget a{font-size: 20px;text-decoration: none;}')
			expect(html).toBe('<div id="widget"><p><a href="http://bla.com">link label</a></p></div>')
			done();
		}, { minify: true,  data: { label: "link label"} });
	});

});
describe("Nested components", function() {

	var api = require('../../../index.js')();

	it("should use a nested components", function(done) {
		var head = function() {
			return {
				css: {
					body: {
						width: "100%",
						height: "100%",
						margin: "10px",
						padding: "0px"
					}
				},
				html: {
					head: {
						title: "That's my page"
					}
				}
			};
		}
		var title = {
			css: {
				".title": {
					fontSize: "24px"
				}
			},
			html: {
				"h1.title": "Hello world"
			}
		}
		var body = function() {
			return {
				css: {
					h1: { fontWeight: "normal" },
					p: { fontSize: "24px", lineHeight: "28px" }
				},
				html: {
					body: {
						_include: title,
						p: "Text of the <b>page</b>."
					}
				}
			}
		}
		var page = function() {
			return {
				css: {
					body: {
						margin: "0px",
						section: {
							marginTop: "20px",
							"@media all and (max-width: 640px)": {
								marginTop: "10px"
							}
						}
					}
				},
				html: {
					_: "<!DOCTYPE html>",
					html: {
						_include: [head, body]
					}
				}
			}
		}
		api.morph("component").add(page).compile(function(err, css, html) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(html).toBeDefined();
			expect(css).toBe("body{margin: 10px;width: 100%;height: 100%;padding: 0px;}body section{margin-top: 20px;}h1{font-weight: normal;}p,.title{font-size: 24px;}p{line-height: 28px;}@media all and (max-width: 640px){body section{margin-top: 10px;}}");
			expect(html).toBe('<!DOCTYPE html><html><head><title>That\'s my page</title></head><body><h1 class="title">Hello world</h1><p>Text of the <b>page</b>.</p></body></html>');
			done();
		}, { minify: true })
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should compile nested tags", function(done) {
		var headTags = [
			{ title: "page title" },
			{ style: {} }
		];
		api.morph("html").add({
			html: {
				head: headTags,
				body: {}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html><head><title>page title</title><style></style></head><body></body></html>');
			done();
		}, { minify: true });
	});

	it("should compile list", function(done) {
		api.morph("html").add({
			html: {
				body: {
					ul: [
						{ li: 'A' },
						{ li: 'B' },
						{ li: 'C' },
						{ li: 'D' }
					]
				}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html><body><ul><li>A</li><li>B</li><li>C</li><li>D</li></ul></body></html>');
			done();
		}, { minify: true });
	});

	it("should compile array of strings", function(done) {
		api.morph("html").add({
			html: [
				'<body>',
				'<h1>Title</h1>',
				'</body>'
			]
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html><body><h1>Title</h1></body></html>');
			done();
		}, { minify: true });
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("complex html", function(done) {
		api.morph("html").add({
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
					_attrs: { cls: "home-page" },
					section: {
						h1: "that's html page"
					}
				}
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<!DOCTYPE html><html><head><title>html page</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta></head><body cls="home-page"><section><h1>that\'s html page</h1></section></body></html>');
			done();
		}, { minify: true });
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

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
		api.morph("html").add({
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
			expect(html).toBe('<html><head><title>html page</title></head><body><form><label>Please fill the form</label><input type="text" placeholder="Please type your username" name="username"></input><input type="text" placeholder="Please type your email" name="email"></input><input type="submit" value="submit the data"></input></form></body></html>');
			done();
		}, { minify: true });
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should compile html with data", function(done) {
		api.morph("html").add({
			body: {
				h1: "<% this.name %> <small>(<% this.profile.job %>)</small>"
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body><h1>John <small>(Developer)</small></h1></body>');
			done();
		}, {
			minify: true,
			name: "John", profile: { job: "Developer" }
		})
	});

	it("should use 'if' statement", function(done) {
		api.morph("html").add({
			body: {
				h1: [
					"<% if(this.developer) { %>",
					{ p: "I'm a developer" },
					"<% } %>"
				]
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body><h1><p>I\'m a developer</p></h1></body>');
			done();
		}, {
			minify: true,
			developer: true
		})
	});

	it("should use 'if' statement (false)", function(done) {
		api.morph("html").add({
			body: {
				h1: [
					"<% if(this.developer) { %>",
					{ p: "I'm a developer" },
					"<% } %>"
				]
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body><h1></h1></body>');
			done();
		}, {
			minify: true,
			developer: false
		})
	});

	it("should use 'if/else' statement", function(done) {
		api.morph("html").add({
			body: {
				h1: [
					"<% if(this.developer) { %>",
					{ p: "I'm a developer" },
					"<% } else { %>",
					{ small: "Damn, I can't code!"},
					"<% } %>"
				]
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body><h1><small>Damn, I can\'t code!</small></h1></body>');
			done();
		}, {
			minify: true,
			developer: false
		})
	});

	it("should use 'switch' statement", function(done) {
		api.morph("html").add({
			body: [
				"<% switch(this.theme) { %>",
				"<% case 'black': %>",
				{ h1: "black"},
				"<% break; %>",
				"<% case 'blue': %>",
				{ h1: "blue"},
				"<% break; %>",
				"<% } %>"
			]
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body><h1>blue</h1></body>');
			done();
		}, {
			minify: true,
			theme: "blue"
		})
	});

	it("should use for loop", function(done) {
		api.morph("html").add({
			body: {
				p: "Hello, my name is <%this.data.name%>!",
				small: "I'm \"<% this.data.profile.age %>\" {years} old",
				ul: [	
					'<% for(var i=0; i<this.data.skills.length, skill=this.data.skills[i]; i++) { %>',
					{
						li: {
							'a[href="#<% skill %>"]': 'I do <% skill %>'
						}
					},
					'<% } %>'
				]
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body><p>Hello, my name is John!</p><small>I\'m "29" {years} old</small><ul><li><a href="#javascript">I do javascript</a></li><li><a href="#html">I do html</a></li><li><a href="#css">I do css</a></li></ul></body>');
			done();
		}, {
			minify: true,
			data: {
				name: "John",
				profile: { age: 29 },
				skills: ['javascript', 'html', 'css']
			}
		});
	});

	it("should accept normal html", function(done) {
		api.morph("html").add('<p><% this.data.name %>: <% this.data.skills.length %></p><ul><% for(var i=0; i<this.data.skills.length, skill=this.data.skills[i]; i++) { %><li><a href="#"><% skill %></a></li><% } %></ul>').compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<p>John: 3</p><ul><li><a href="#">javascript</a></li><li><a href="#">html</a></li><li><a href="#">css</a></li></ul>');
			done();
		}, {
			minify: true,
			data: {
				name: "John",
				skills: ['javascript', 'html', 'css']
			}
		});
	});

	it("should use expressioninside the tag", function(done) {
		var html = '\
			<ul id="todo-list">\
				<% for(var i=0; todo = this.todos[i]; i++) { %>\
				<li class="<% todo.completed ? \'completed\' : \'\' %>">\
					<div class="view">\
						<input class="toggle" type="checkbox" <% todo.completed ? \'checked\' : \'\'%>>\
						<label><% todo.title %></label>\
						<button class="destroy"></button>\
					</div>\
					<input class="edit" value="">\
				</li>\
				<% } %>\
			</ul>\
		';
		api.morph("html").add(html).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<ul id="todo-list"><li class=""><div class="view"><input class="toggle" type="checkbox" ><label>A</label><button class="destroy"></button></div><input class="edit" value=""></li><li class="completed"><div class="view"><input class="toggle" type="checkbox" checked><label>B</label><button class="destroy"></button></div><input class="edit" value=""></li></ul>');
			done();
		}, {
			minify: true,
			todos: [
				{ title: 'A', completed: false },
				{ title: 'B', completed: true }
			]
		});
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

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
		api.morph("html").add({
			html: {
				head: getTitleTag("Absurd is awesome"),
				body: bodyContent
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html><head><title>Absurd is awesome</title></head><body><p>text</p></body></html>');
			done();
		}, { minify: true });
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should use _include", function(done) {
		var profile = function() {
			return {
				".profile": {
					"span.name": "John Doe"
				}
			}
		}
		var logo = {
			".logo": {
				'img[src="#"]': null
			}
		}
		var nav = {
			nav: [
				{ 'a[href="#"]': "Home" },
				{ 'a[href="#"]': "Products" },
				{ 'a[href="#"]': "Contacts" }
			]
		}
		var header = {
			header: {
				_include: [logo, nav, profile]
			}
		}
		var page = {
			html: {
				body: {
					_include: header
				}
			}
		}
		api.morph("html").add(page).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html><body><header><div class="logo"><img src="#"/></div><nav><a href="#">Home</a><a href="#">Products</a><a href="#">Contacts</a></nav><div class="profile"><span class="name">John Doe</span></div></header></body></html>');
			done();
		}, { minify: true });
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should minify html", function(done) {
		api.morph("html").add({
			body: {
				header: "header",
				section: [
					{ p: "test" },
					{ p: "lorem ipsum" },
					{ img: null }
				]
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body><header>header</header><section><p>test</p><p>lorem ipsum</p><img/></section></body>');
			done();
		}, { minify: true });
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should use templates", function(done) {

		api.morph("html").add({
			'.content': "AbsurdJS <% type %> preprocessor and <% language('JavaScript') %> library."
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content">AbsurdJS cSS preprocessor and JAVASCRIPT library.</div>');
			done();
		}, { 
			minify: true,
			type: 'cSS',
			language: function(l) {
				return l.toUpperCase();
			}
		});
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should compile an empty tag", function(done) {
		api.morph("html").add({
			body: null
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body/>');
			done();
		}, { minify: true });
	});

	it("should compile tag with text inside", function(done) {
		api.morph("html").add({
			body: "page text"
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body>page text</body>');
			done();
		}, { minify: true });
	});

	it("should compile tag with attributes", function(done) {
		api.morph("html").add({
			body: {
				_attrs: { cls: "black" }
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body cls="black"></body>');
			done();
		}, { minify: true });
	});

	it("should compile tag with attributes and text inside", function(done) {
		api.morph("html").add({
			body: {
				_attrs: { cls: "black" },
				_: "page text"
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body cls="black">page text</body>');
			done();
		}, { minify: true });
	});

	it("should compile tag with attributes, text inside and nested tag", function(done) {
		api.morph("html").add({
			body: {
				_attrs: { cls: "black" },
				_: "page text",
				p: "paragraph text"
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<body cls="black">page text<p>paragraph text</p></body>');
			done();
		}, { minify: true });
	});

	it("should compile raw content", function(done) {
		api.morph("html").add({
			_: '<html></html>'
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html></html>');
			done();
		}, { minify: true });
	});	

	it("should compile nested tags", function(done) {
		api.morph("html").add({
			html: {
				head: {
					title: "title"
				},
				body: null
			}
		}).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<html><head><title>title</title></head><body/></html>');
			done();
		}, { minify: true });
	});

	it("should compile raw content + nested tag", function(done) {
		api.morph("html").add({
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
			expect(html).toBe('<body><p>That\'s my text<a href="#">read more</a></p></body>');
			done();
		}, { minify: true });
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should use templates", function(done) {

		api.morph("html").add({
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
			expect(html).toBe('<html><head><title>AbsurdJS preprocessor</title></head><body><h1>oh yeah</h1><a href="#" target="_blank">link</a><footer>footer text</footer></body></html>');
			done();
		}, { minify: true });
	});

});
describe("Metamorphosis (to html preprocessor)", function() {

	var api = require('../../../index.js')();

	it("should use classes", function(done) {
		var tags = {
			"div.content": {
				p: "text"
			}
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content"><p>text</p></div>');
			done();
		}, { minify: true });
	});

	it("should use two classes", function(done) {
		var tags = {
			"div.content.left": {
				p: "text"
			}
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left"><p>text</p></div>');
			done();
		}, { minify: true });
	});

	it("should use id", function(done) {
		var tags = {
			"div#content": {
				p: "text"
			}
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div id="content"><p>text</p></div>');
			done();
		}, { minify: true });
	});

	it("should use id and class together", function(done) {
		var tags = {
			"div.content#home.left": {
				p: "text"
			}
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left" id="home"><p>text</p></div>');
			done();
		}, { minify: true });
	});

	it("should use without tag name", function(done) {
		var tags = {
			".content#home.left": {
				p: "text"
			}
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left" id="home"><p>text</p></div>');
			done();
		}, { minify: true });
	});

	it("should pass attributes", function(done) {
		var tags = {
			'.content[data-behaviour="clickable" title="test" style="position: absolute; top: 20px; left: 30px;"]#home': {
				'img[alt="that\'s my image" some__data="1"]': null
			}
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content" id="home" data-behaviour="clickable" title="test" style="position: absolute; top: 20px; left: 30px;"><img alt="that\'s my image" some__data="1"/></div>');
			done();
		}, { minify: true });
	});

	it("should pass attributes", function(done) {
		var tags = {
			'.content.left#wrapper': {
				'a[href="http://krasimir.github.io/absurd/"]': "AbsurdJS documentation",
				'p.text[title="description" data-type="selectable"]': "CSS preprocessor"
			}
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content left" id="wrapper"><a href="http://krasimir.github.io/absurd/">AbsurdJS documentation</a><p class="text" title="description" data-type="selectable">CSS preprocessor</p></div>');
			done();
		}, { minify: true });
	});

	it("should create a div by default", function(done) {
		var tags = {
			'[class="content"]': "test"
		}
		api.morph("html").add(tags).compile(function(err, html) {
			expect(err).toBe(null);
			expect(html).toBeDefined();
			expect(html).toBe('<div class="content">test</div>');
			done();
		}, { minify: true });
	});

});
describe("Should use jsonify", function() {

	var api = require('../../index.js')();
	var api2 = require('../../index.js')();
	var css = '@keyframes NAME-YOUR-ANIMATION {\n\
0% {\n\
  opacity: 0;\n\
}\n\
100% {\n\
  opacity: 1;\n\
}\n\
}\n\
@-webkit-keyframes NAME-YOUR-ANIMATION {\n\
0% {\n\
  opacity: 0;\n\
}\n\
100% {\n\
  opacity: 1;\n\
}\n\
}\n\
.header {\n\
  margin: 0;\n\
  font-size: 20px;\n\
}\n\
.header p {\n\
  line-height: 22px;\n\
  box-sizing: border-box;\n\
}\n\
@media all and (max-width: 460px) {\n\
  .header p {\n\
    line-height: 33px;\n\
    color: #000;\n\
    padding-top: 10px;\n\
  }\n\
}\n';

	it("should compile properly by using jsonify", function(done) {
		api
		.morph('jsonify')
		.add({
			body: {
				p: { fz: '20px'},
				a: { ted: 'n'}
			},
			'@media all and (max-width: 330px)': {
				p: { fz: '22px' }
			}
		})
		.compile(function(err, json) {
			expect(JSON.stringify(json)).toBe('{"body":{"p":{"fz":"20px"},"a":{"ted":"n"}},"@media all and (max-width: 330px)":{"p":{"fz":"22px"}}}');
			done();
		});
	});	

	it("should compile properly by using jsonify and importCSS", function(done) {
		api
		.morph('jsonify')
		.importCSS(css)
		.compile(function(err, json) {
			api2.add(json).compile(function(err, cssFinal) {
				expect(css).toBe(cssFinal);
				done();
			});
		});
	});

});
describe("Dependency injector", function() {

	var api = require('../../index.js')();

	it("should have the injector API available", function(done) {
		expect(api.di).toBeDefined();
		expect(api.di).not.toBe(null);
		done();
	});

	it("should define a dependency and use it", function(done) {
		api.di.register("AwesomeModule", function() {
			return 42;
		});
		var doSomething = api.di.resolve(function(AwesomeModule) {
			expect(AwesomeModule()).toBe(42);
			done();
		});
		doSomething();
	});

	it("should use other parameters", function(done) {
		api.di.flush().register("AwesomeModule", function() {
			return 30;
		});
		var doSomething = api.di.resolve(function(a, AwesomeModule, b) {
			expect(a).toBe(2);
			expect(b).toBe(10);
			expect(AwesomeModule() + a + b).toBe(42);
			done();
		});
		doSomething(2, 10);
	});

	it("should protect from minification", function(done) {
		api.di.flush()
		.register("AwesomeModule", function() {
			return 30;
		})
		.register("UselessModule", function() {
			return 'absolutely nothing';
		});

		var doSomething = api.di.resolve(',AwesomeModule,,UselessModule', function(a, AwesomeModule, b, UselessModule) {
			expect(a).toBe(2);
			expect(b).toBe(10);
			expect(AwesomeModule() + a + b).toBe(42);
			expect(UselessModule()).toBe('absolutely nothing');
			done();
		});
		doSomething(2, 10);
	});

	it("should keep the scope", function(done) {
		api.di.flush().register("AwesomeModule", function() {
			return 42;
		});
		var component = {
			answer: 0,
			print: function() {
				return "The answer is " + this.answer;
			},
			doSomething: function(AwesomeModule) {
				this.answer = AwesomeModule();
				expect(this.print()).toBe("The answer is 42");
				done();
			}
		}
		component.doSomething = api.di.resolve(component.doSomething, component);
		component.doSomething();
	});

	it("should resolve an object", function(done) {
		api.di.flush().register("AwesomeModule", function() {
			return 42;
		});
		var component = {
			answer: 0,
			print: function() {
				return "The answer is " + this.answer;
			},
			doSomething: function(AwesomeModule) {
				this.answer = AwesomeModule();
				expect(this.print()).toBe("The answer is 42");
				done();
			}
		}
		api.di.resolveObject(component);
		component.doSomething();
	});

	it("should resolve an object protected from minification", function(done) {
		api.di.flush()
		.register("AwesomeModule", function() {
			return 42;
		})
		.register("UselessModule", function() {
			return 'absolutely nothing';
		});
		var component = {
			answer: 0,
			print: function() {
				return "The answer is " + this.answer;
			},
			doSomething: ['AwesomeModule, UselessModule', function(AwesomeModule, UselessModule) {
				this.answer = AwesomeModule();
				expect(this.print()).toBe("The answer is 42");
				expect(UselessModule()).toBe("absolutely nothing");
				done();
			}]
		}
		api.di.resolveObject(component);
		component.doSomething();
	});

	it("should use same function with different parameters", function(done) {
		api.di.flush().register("service", function(value) {
			return value;
		});
		var App = {
			init: [',service,', function(a, service, b) {
				if(!this.tested) {
					this.tested = true;
					expect(service(42)).toBeDefined(42);
					expect(a.value).toBe("A");
					expect(b.value).toBe("B");
				} else {
					expect(a.value).toBe(10);
					expect(b.value).toBe(20);
					done();
				}
				return this;
			}]
		};
		api.di.resolveObject(App);
		App.init(
			{ value: "A" },
			{ value: "B" }
		).init(
			{ value: 10 },
			{ value: 20 }
		);
	});

	it("should be able to pass a boolean", function(done) {
		api.di.register("BooleanValue", false);
		var doSomething = api.di.resolve(function(BooleanValue) {
			expect(BooleanValue).toBeDefined();
			expect(typeof BooleanValue).toBe('boolean');
			expect(BooleanValue).toBe(false);
			done();
		});
		doSomething();
	});

	it("should use the host", function(done) {
		var ExternalService = {
			gogo: function() {
				return this.host.name;
			}
		}
		api.di.register("es", ExternalService);
		var doSomething = api.di.resolve(function(es) {
			this.name = 42;
			expect(es.gogo()).toBe(42);
			done();
		});
		doSomething();
	});

	it("should use the host while a function is injected", function(done) {
		var ExternalService = function() {
			return { name: this.host.name };
		}
		api.di.register("es", ExternalService);
		var doSomething = api.di.resolve(function(es) {
			this.name = 42;
			expect((new es()).name).toBe(42);
			done();
		});
		doSomething();
	});

});
describe("Animations", function() {

	var api = require('../../index.js')();

	it("should use bounce", function(done) {
		api.add({
			div: {
				'&:hover': {
					animate: 'bounce'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('@keyframes bounce {0%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}20%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}50%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}80%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}100%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}40%{transform: translateY(-30px);-webkit-transform: translateY(-30px);-moz-transform: translateY(-30px);-ms-transform: translateY(-30px);-o-transform: translateY(-30px);}60%{transform: translateY(-15px);-webkit-transform: translateY(-15px);-moz-transform: translateY(-15px);-ms-transform: translateY(-15px);-o-transform: translateY(-15px);}}@-webkit-keyframes bounce {0%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}20%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}50%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}80%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}100%{transform: translateY(0);-webkit-transform: translateY(0);-moz-transform: translateY(0);-ms-transform: translateY(0);-o-transform: translateY(0);}40%{transform: translateY(-30px);-webkit-transform: translateY(-30px);-moz-transform: translateY(-30px);-ms-transform: translateY(-30px);-o-transform: translateY(-30px);}60%{transform: translateY(-15px);-webkit-transform: translateY(-15px);-moz-transform: translateY(-15px);-ms-transform: translateY(-15px);-o-transform: translateY(-15px);}}div:hover{animation-name: bounce;-webkit-animation-name: bounce;-moz-animation-name: bounce;-ms-animation-name: bounce;-o-animation-name: bounce;animation-duration: 1s;-webkit-animation-duration: 1s;-moz-animation-duration: 1s;-ms-animation-duration: 1s;-o-animation-duration: 1s;}');
			done();
		}, { minify: true });
	});

	it("should define an animation and apply it", function(done) {
		api.flush().add({
			keyframes: {
				name: "preloader",
				frames: {
					"0%": { fz: '10px', margin: 0, pad: '20px' },
					"50%": { fz: '20px', margin: '10px' },
					"100%": { fz: '10px', margin: '20px', pad: '22px' }
				}
			}
		})
		.add({
			'.preloader': {
				animate: {
					name: 'preloader',
					iterationCount: 'infinite'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('@keyframes preloader {0%{font-size: 10px;padding: 20px;margin: 0;}50%{font-size: 20px;margin: 10px;}100%{font-size: 10px;padding: 22px;margin: 20px;}}@-webkit-keyframes preloader {0%{font-size: 10px;padding: 20px;margin: 0;}50%{font-size: 20px;margin: 10px;}100%{font-size: 10px;padding: 22px;margin: 20px;}}.preloader{animation-name: preloader;-webkit-animation-name: preloader;-moz-animation-name: preloader;-ms-animation-name: preloader;-o-animation-name: preloader;animation-duration: 1s;-webkit-animation-duration: 1s;-moz-animation-duration: 1s;-ms-animation-duration: 1s;-o-animation-duration: 1s;animation-iteration-count: infinite;-webkit-animation-iteration-count: infinite;-moz-animation-iteration-count: infinite;-ms-animation-iteration-count: infinite;-o-animation-iteration-count: infinite;}');
			done();
		}, { minify: true });
	});

	it("should use blink", function(done) {
		api.add({
			div: {
				animate: 'blink'
			}
		}).compile(function(err, css) {
			expect(css).toBe('@keyframes blink {0%{filter: alpha(opacity=0);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);opacity: 0;-moz-opacity: 0;-khtml-opacity: 0;}100%{filter: alpha(opacity=0);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);opacity: 0;-moz-opacity: 0;-khtml-opacity: 0;}50%{filter: alpha(opacity=100);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);opacity: 1;-moz-opacity: 1;-khtml-opacity: 1;}}@-webkit-keyframes blink {0%{filter: alpha(opacity=0);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);opacity: 0;-moz-opacity: 0;-khtml-opacity: 0;}100%{filter: alpha(opacity=0);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);opacity: 0;-moz-opacity: 0;-khtml-opacity: 0;}50%{filter: alpha(opacity=100);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);opacity: 1;-moz-opacity: 1;-khtml-opacity: 1;}}div{animation-name: blink;-webkit-animation-name: blink;-moz-animation-name: blink;-ms-animation-name: blink;-o-animation-name: blink;animation-duration: 1s;-webkit-animation-duration: 1s;-moz-animation-duration: 1s;-ms-animation-duration: 1s;-o-animation-duration: 1s;}');
			done();
		}, { minify: true });
	});

	it("should define an animation with animate method", function(done) {
		api.add({
			div: {
				animate: {
					name: 'awesome-anim',
					frames: {
						'0%': { fz: '10px' },
						'100%': { fz: '20px' }
					}
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('@keyframes awesome-anim {0%{font-size: 10px;}100%{font-size: 20px;}}@-webkit-keyframes awesome-anim {0%{font-size: 10px;}100%{font-size: 20px;}}div{animation-name: awesome-anim;-webkit-animation-name: awesome-anim;-moz-animation-name: awesome-anim;-ms-animation-name: awesome-anim;-o-animation-name: awesome-anim;animation-duration: 1s;-webkit-animation-duration: 1s;-moz-animation-duration: 1s;-ms-animation-duration: 1s;-o-animation-duration: 1s;}');
			done();
		}, { minify: true });
	});

	it("should only define an animation with animate method", function(done) {
		api.add({
			div: {
				animate: ['awesome-anim', {
					'0%': { fz: '10px' },
					'100%': { fz: '20px' }
				}]
			}
		}).compile(function(err, css) {
			expect(css).toBe('@keyframes awesome-anim {0%{font-size: 10px;}100%{font-size: 20px;}}@-webkit-keyframes awesome-anim {0%{font-size: 10px;}100%{font-size: 20px;}}');
			done();
		}, { minify: true });
	});

})
describe("Testing atoms", function() {

	var api = require('../../index.js')();

	it("should use atom 1", function(done) {
		api.add({
			body: {
				atoms: {
					pad: '10px',
					fz: '16px',
					d: 'b'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{padding: 10px;font-size: 16px;display: block;}');
			done();
		}, { minify: true})
	});

	it("should use atom 2", function(done) {
		api.add({
			body: {
				atoms: ['pad: 10px', 'fz : 16px', 'd:b']
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{padding: 10px;font-size: 16px;display: block;}');
			done();
		}, { minify: true})
	});

	it("should use atom 3", function(done) {
		api.add({
			body: {
				atoms: 'pad:10px/fz:16px/d:b'
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{padding: 10px;font-size: 16px;display: block;}');
			done();
		}, { minify: true})
	});

	it("should use atom 4", function(done) {
		api.add({
			body: {
				pad: '10px',
				fz: '16px',
				d: 'b'
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{padding: 10px;font-size: 16px;display: block;}');
			done();
		}, { minify: true})
	});

	it("should use prefixes", function(done) {
		api.add({
			body: {
				atoms: '-bxz:bb'
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;-ms-box-sizing: border-box;-o-box-sizing: border-box;}');
			done();
		}, { minify: true})
	});

	it("should use only few prefixes", function(done) {
		api.add({
			body: {
				atoms: '-mw-bxz:bb',
				p: {
					atoms: '-w-trs: all 4000ms'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;}body p{transition: all 4000ms;-webkit-transition: all 4000ms;}');
			done();
		}, { minify: true})
	});

	it("should use atom with function and prefix", function(done) {
		api.add({
			body: {
				p: [
					{ d: 'b' },
					{
						'-ws-pos': function() {
							return 'static';
						}
					}
				]
			}
		}).compile(function(err, css) {
			expect(css).toBe('body p{display: block;position: static;-webkit-position: static;-ms-position: static;}');
			done();
		}, { minify: true})
	});

});
describe("Testing molecules", function() {

	var api = require('../../index.js')();

	it("should use size", function(done) {
		api.add({
			body: {
				size: 100,
				p: {
					size: '30/40'
				},
				section: {
					size: '/200px'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body{width: 100%;height: 100%;}body p{width: 30%;height: 40%;}body section{height: 200px;}');
			done();
		}, { minify: true})
	});

	it("should use cf", function(done) {
		api.add({
			body: {
				cf: 'all',
				p: {
					cf: 'before'
				},
				section: {
					cf: 'after'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('body:before,body:after,body p:before,body section:after{content: " ";display: table;clear: both;}');
			done();
		}, { minify: true })
	});

	it("should use moveto", function(done) {
		api.add({
			p: {
				moveto: '10/20/30'
			}
		}).compile(function(err, css) {
			expect(css).toBe('p{transform: translate3d(10px,20px,30px);-webkit-transform: translate3d(10px,20px,30px);-ms-transform: translate3d(10px,20px,30px);}');
			done();
		}, { minify: true })
	});

	it("should use rotateto", function(done) {
		api.add({
			'.content': {
				rotateto: 25,
				section: {
					rotateto: '-30deg',
				},
				a: {
					rotateto: '10',
					moveto: '20/30'
				}
			}
		}).compile(function(err, css) {
			expect(css).toBe('.content{transform: rotate(25deg);-webkit-transform: rotate(25deg);-ms-transform: rotate(25deg);}.content section{transform: rotate(-30deg);-webkit-transform: rotate(-30deg);-ms-transform: rotate(-30deg);}.content a{transform: rotate(10deg) translate(20px,30px);-webkit-transform: rotate(10deg) translate(20px,30px);-ms-transform: rotate(10deg) translate(20px,30px);}');
			done();
		}, { minify: true })
	});

	it("should use scaleto", function(done) {
		api.add({
			p: {
				scaleto: '1.4/1.3',
				moveto: '30/0'
			}
		}).compile(function(err, css) {
			expect(css).toBe('p{transform: scale(1.4,1.3) translate(30px,0px);-webkit-transform: scale(1.4,1.3) translate(30px,0px);-ms-transform: scale(1.4,1.3) translate(30px,0px);}');
			done();
		}, { minify: true });
	});

	it("should use grid", function(done) {
		api.add({
			'section.container': {
				grid: '3/div'
			}
		}).compile(function(err, css) {
			expect(css).toBe('section.container:before,section.container:after{content: " ";display: table;clear: both;}section.container div{float: left;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;width: 33.33%;}');
			done();
		}, { minify: true });
	});

	it("should use transparent", function(done) {
		api.add({
			'section.container': {
				transparent: 0.4
			}
		}).compile(function(err, css) {
			expect(css).toBe('section.container{filter: alpha(opacity=40);-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);opacity: 0.4;-moz-opacity: 0.4;-khtml-opacity: 0.4;}');
			done();
		}, { minify: true });
	});

	it("should use gradient", function(done) {
		api.add({
			'section.container': {
				gradient: '#F00/#00F'
			}
		}).compile(function(err, css) {
			expect(css).toBe("section.container{background: -webkit-linear-gradient(0deg,#F00 0%,#00F 100%);background: -moz-linear-gradient(0deg,#F00 0%,#00F 100%);background: -ms-linear-gradient(0deg,#F00 0%,#00F 100%);background: -o-linear-gradient(0deg,#F00 0%,#00F 100%);background: linear-gradient(0deg,#F00 0%,#00F 100%);filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FF0000FF',endColorstr='#FFFF0000',GradientType=0);-ms-filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FF0000FF',endColorstr='#FFFF0000',GradientType=0);}");
			done();
		}, { minify: true });
	});

	it("should use gradient with angle", function(done) {
		api.add({
			'section.container': {
				gradient: '#F00/#00F/#0F0/75deg'
			}
		}).compile(function(err, css) {
			expect(css).toBe("section.container{background: -webkit-linear-gradient(75deg,#F00 0%,#00F 50%,#0F0 100%);background: -moz-linear-gradient(75deg,#F00 0%,#00F 50%,#0F0 100%);background: -ms-linear-gradient(75deg,#F00 0%,#00F 50%,#0F0 100%);background: -o-linear-gradient(75deg,#F00 0%,#00F 50%,#0F0 100%);background: linear-gradient(75deg,#F00 0%,#00F 50%,#0F0 100%);filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFFF0000',endColorstr='#FF00FF00',GradientType=1);-ms-filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFFF0000',endColorstr='#FF00FF00',GradientType=1);}");
			done();
		}, { minify: true });
	});

	it("should use gradient with angle and specific stops position", function(done) {
		api.add({
			'section.container': {
				gradient: '#F00/#00F 5%/#BADA55 95%/#0F0/75deg'
			}
		}).compile(function(err, css) {
			expect(css).toBe("section.container{background: -webkit-linear-gradient(75deg,#F00 0%,#00F 5%,#BADA55 95%,#0F0 99%);background: -moz-linear-gradient(75deg,#F00 0%,#00F 5%,#BADA55 95%,#0F0 99%);background: -ms-linear-gradient(75deg,#F00 0%,#00F 5%,#BADA55 95%,#0F0 99%);background: -o-linear-gradient(75deg,#F00 0%,#00F 5%,#BADA55 95%,#0F0 99%);background: linear-gradient(75deg,#F00 0%,#00F 5%,#BADA55 95%,#0F0 99%);filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFFF0000',endColorstr='#FF00FF00',GradientType=1);-ms-filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#FFFF0000',endColorstr='#FF00FF00',GradientType=1);}");
			done();
		}, { minify: true });
	});

	it("should use blur", function(done) {
		api.add({
			'.container': {
				blur: 10
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{filter: blur(10px);-webkit-filter: blur(10px);-moz-filter: blur(10px);-ms-filter: blur(10px);}");
			done();
		}, { minify: true });
	});

	it("should use brightness", function(done) {
		api.add({
			'.container': {
				brightness: 0.5
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{filter: brightness(0.5);-webkit-filter: brightness(0.5);-moz-filter: brightness(0.5);-ms-filter: brightness(0.5);}");
			done();
		}, { minify: true });
	});

	it("should use contrast", function(done) {
		api.add({
			'.container': {
				contrast: 230
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{filter: contrast(230%);-webkit-filter: contrast(230%);-moz-filter: contrast(230%);-ms-filter: contrast(230%);}");
			done();
		}, { minify: true });
	});

	it("should use invert", function(done) {
		api.add({
			'.container': {
				invert: 80
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{filter: invert(80%);-webkit-filter: invert(80%);-moz-filter: invert(80%);-ms-filter: invert(80%);}");
			done();
		}, { minify: true });
	});

	it("should use saturate", function(done) {
		api.add({
			'.container': {
				saturate: 80
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{filter: saturate(80deg);-webkit-filter: saturate(80deg);-moz-filter: saturate(80deg);-ms-filter: saturate(80deg);}");
			done();
		}, { minify: true });
	});

	it("should use sepia", function(done) {
		api.add({
			'.container': {
				sepia: 80
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{filter: sepia(80%);-webkit-filter: sepia(80%);-moz-filter: sepia(80%);-ms-filter: sepia(80%);}");
			done();
		}, { minify: true });
	});

	it("should use calc", function(done) {
		api.add({
			'.container': {
				calc: 'width/100% - 45px'
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{-lh-property: 0;width: -webkit-calc(100% - 45px);width: -moz-calc(100% - 45px);width: calc(100% - 45px);}");
			done();
		}, { minify: true });
	});

	it("should use dropshadow", function(done) {
		api.add({
			'.container': {
				dropshadow: '16px 16px 10px #000000'
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{filter: drop-shadow(16px 16px 10px #000000);-webkit-filter: drop-shadow(16px 16px 10px #000000);-moz-filter: drop-shadow(16px 16px 10px #000000);-ms-filter: drop-shadow(16px 16px 10px #000000);}");
			done();
		}, { minify: true });
	});

	it("should use trsform", function(done) {
		api.add({
			'.container': {
				trsform: 'rotate(-20deg) scale(1.2, 1.2)'
			}
		}).compile(function(err, css) {
			expect(css).toBe(".container{transform: rotate(-20deg) scale(1.2,1.2);-webkit-transform: rotate(-20deg) scale(1.2,1.2);-moz-transform: rotate(-20deg) scale(1.2,1.2);-ms-transform: rotate(-20deg) scale(1.2,1.2);-o-transform: rotate(-20deg) scale(1.2,1.2);}");
			done();
		}, { minify: true });
	});

});
describe("Moving a selector to the top of the chain", function() {

	var api = require('../../index.js')();

	it("should move a selector", function(done) {
		api.add({
		    '.test': {
		        '.some, .sel': {
		            '^html.ie8': {
		                color: "#333"
		            },
		            width: "100%"
		        }
		    }
		}).compile(function(err, css) {
			expect(css).toBe('.test .some,.test .sel{width: 100%;}html.ie8 .test .some,html.ie8 .test .sel{color: #333;}');
			done();
		}, { minify: true });
	});

	it("should move a selector complex", function(done) {
		api.add({
		    '.a': {
		        '.b': {
		        	'^.bg': {
		        		fz: '20px'
		        	},
		        	fz: '10px',
		        	p: {
		        		mar: '4px',
		        		'^.en': {
		        			mar: '12px',
		        			small: {
		        				wid: '30%'
		        			}
		        		}
		        	}
		        },
		        '^.de': {
		        	'.b': {
		        		fz: '30px'
		        	}
		        }
		    }
		}).compile(function(err, css) {
			expect(css).toBe(".a .b{font-size: 10px;}.bg .a .b{font-size: 20px;}.a .b p{margin: 4px;}.en .a .b p{margin: 12px;}.en .a .b p small{width: 30%;}.de .a .b{font-size: 30px;}");
			done();
		}, { minify: true });
	});

});
describe("Should allow setting styles with same names", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.add({
		    body: {
		    	p: [
		    		{ color: "rgb(0,0,0)" },
		    		{ '%%color': "rgba(0,0,0,0.5)" },
		    		{ '%2%color': "rgba(0,0,0,0.1)" },
		    		{ '% %color': "rgba(0,0,0,0.1)" }
		    	],
		    	section: {
		    		wid: '50%',
		    		'.left': {
		    			wid: '10%',
		    			'%width': '20px'
		    		},
		    		'background': '#F00',
		    		'%%background': '10% 20% 30%',
		    		'%__%background': '40% test 20%'
		    	}
		    }
		}).compile(function(err, css) {
			expect(css).toBe('body p{color: rgb(0,0,0);color: rgba(0,0,0,0.5);color: rgba(0,0,0,0.1);color: rgba(0,0,0,0.1);}body section{width: 50%;background: #F00;background: 10% 20% 30%;background: 40% test 20%;}body section .left{width: 10%;%width: 20px;}');
			done();
		}, { minify: true });
	});

	it("should compile properly", function(done) {
		api.add({
		    '@font-face': [
		        { fontFamily: "'gethuman'" },
		        { '%1%src': "url('../fonts/gh2.eot')"},
		        { '%%src': "url('../fonts/gh2.eot?#iefix')"		        }
		    ]
		}).compile(function(err, css) {
			expect(css).toBe("@font-face{font-family: 'gethuman';src: url('../fonts/gh2.eot');src: url('../fonts/gh2.eot?#iefix');}");
			done();
		}, { minify: true });
	});

});
describe("Should report errors properly", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		try {
			api.add({
			    body: {
			    	width: undefined,
			    	padding: '20px'
			    }
			}).compile(function(err, css) {
				console.log(css);			
				done();
			}, { minify: false });
		} catch(err) {
			expect(err.toString().indexOf('Error: Error adding: {"rules":{"body":{"padding":"20px"}}') >= 0).toBe(true);
			done();
		}
	});

});
describe("Should use dynamic expressions in css", function() {

	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.morph('dynamic-css').add({
		    '.content <% elClass %>': {
		    	width: '<% w %>',
		    	padding: '20px'
		    }
		}).compile(function(err, css) {
			expect(css).toBe('.content .black{width: 300px;padding: 20px;}');
			done();
		}, { minify: true, w: '300px', elClass: '.black' });
	});

});