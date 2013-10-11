describe("Adding raw data", function() {

	var Absurd = require('../../index.js'),
		comment = "AbsurdJS is awesome!";

	it("should send raw data", function(done) {
		Absurd(function(api) {
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
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  margin-top: 20px;\n}\nbody p {\n  font-size: 5px;\n}\n/* " + comment + " */\na {\n  padding-top: 20px;\n}\n");
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