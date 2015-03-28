lib.DI = function(api) {
	var injector = {
	    dependencies: {},
	    register: function(key, value) {
	        this.dependencies[key] = value;
	        return this;
	    },
	    resolve: function() {
	        var func, deps, scope, self = this, isForResolving = false;
	        if(typeof arguments[0] === 'string') {
	            func = arguments[1];
	            deps = arguments[0].replace(/ /g, '').split(',');
	            scope = arguments[2] || {};
	        } else {
	            func = arguments[0];
	            deps = func.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].replace(/ /g, '').split(',');
	            scope = arguments[1] || {};
	        }
	        for(var i=0; i<deps.length; i++) {
	        	if(typeof this.dependencies[deps[i]] != 'undefined') isForResolving = true;
	        }
	        if(isForResolving) {
		        return function() {
		        	var args = [];
		            var a = Array.prototype.slice.call(arguments, 0);
		            for(var i=0; i<deps.length; i++) {
		                var d = deps[i];
		                if(typeof self.dependencies[d] != 'undefined') {
		                	var diModule = self.dependencies[d];
		                	if(typeof diModule == 'function') {
		                		diModule.prototype.host = scope;
		                	} else if(typeof diModule == 'object') {
		                		diModule.host = scope;
		                	}
							args.push(diModule);
		                } else {
		                	args.push(a.shift())
		                }
		            }
		            return func.apply(scope, args);
		        }
	    	}
	    	return func;
	    },
	    resolveObject: function(o) {
	    	if(typeof o == 'object') {
	    		for(var key in o) {
	    			if(typeof o[key] == 'function') {
	    				o[key] = this.resolve(o[key], o);
	    			} else if(o[key] instanceof Array && o[key].length == 2 && typeof o[key][0] == 'string' && typeof o[key][1] == 'function') {	    				
	    				o[key] = this.resolve(o[key][0], o[key][1], o);
	    			}
	    		}
	    	}
	    	return this;
	    },
	    flush: function() {
	    	this.dependencies = {};
	    	return this;
	    }
	}
	return injector;
};
lib.api.add = function(API) {
	var extend = require("../helpers/Extend"),
		prefixes = require("../helpers/Prefixes"),
		toRegister = [],
		options = {
			combineSelectors: true,
			preventCombining: ['@font-face']
		};

	var checkAndExecutePlugin = function(selector, prop, value, stylesheet, parentSelector) {
		var prefix = prefixes.nonPrefixProp(prop);
		var plugin = API.getPlugins()[prefix.prop];
		// console.log("\nChecking for plugin: " + prefix.prop + " (" + prop + ")");
		if(typeof plugin !== 'undefined') {
			var pluginResponse = plugin(API, value, prefix.prefix);
			if(pluginResponse) {
				addRule(selector, pluginResponse, stylesheet, parentSelector);
			}
			return true;
		} else {
			return false;
		}
	}
	var addRule = function(selector, props, stylesheet, parentSelector) {
		// console.log("\n---------- addRule ---------", parentSelector + ' >>> ' + selector, "\n", props);

		stylesheet = stylesheet || "mainstream";

		// catching null values
		if(props === null || typeof props === 'undefined' || props === false) return;
		if(!parentSelector && !selector) selector = '';

		// classify
		if(typeof props.classify != 'undefined' && props.classify === true) {
			props = typeof props.toJSON != 'undefined' ? props.toJSON() : props.toString();
		}

		// multiple selectors
		if(/, ?/g.test(selector) && options.combineSelectors) {
			var parts = selector.replace(/, /g, ',').split(',');
			for(var i=0; i<parts.length, p=parts[i]; i++) {
				addRule(p, props, stylesheet, parentSelector);	
			}
			return;
		}

		// check for plugin
		if(checkAndExecutePlugin(null, selector, props, stylesheet, parentSelector)) {
			return;	
		}

		// if array is passed
		if(typeof props.length !== 'undefined' && typeof props === "object") {
			for(var i=0; i<props.length; i++) {
				prop=props[i];
				if(prop) {
					addRule(selector, prop, stylesheet, parentSelector);
				}
			}
			return;
		}

		var _props = {}, 
			_selector = selector,
			_objects = {}, 
			_functions = {};

		// processing props
		for(var prop in props) {
			// classify
			if(props[prop] && typeof props[prop].classify != 'undefined' && props[prop].classify === true) {
				props[prop] = typeof props[prop].toJSON != 'undefined' ? props[prop].toJSON() : props[prop].toString();
			}
			var type = typeof props[prop];
			if(type !== 'object' && type !== 'function' && props[prop] !== false && props[prop] !== true) {
				if(checkAndExecutePlugin(selector, prop, props[prop], stylesheet, parentSelector) === false) {
					// moving the selector to the top of the chain
					if(_selector.indexOf("^") === 0) {
						_selector = _selector.substr(1, _selector.length-1) + (typeof parentSelector !== "undefined" ? " " + parentSelector : '');
					} else {
						_selector = typeof parentSelector !== "undefined" ? parentSelector + " " + selector : selector;
					}
					_props[prop] = props[prop];
					prefixes.addPrefixes(prop, _props);
				}
			} else if(type === 'object') {
				_objects[prop] = props[prop];
			} else if(type === 'function') {
				_functions[prop] = props[prop];
			}
		}

		toRegister.push({
			selector: _selector,
			props: _props,
			stylesheet: stylesheet
		});

		for(var prop in _objects) {
			// check for pseudo classes			
			if(prop.charAt(0) === ":") {
				addRule(selector + prop, _objects[prop], stylesheet, parentSelector);
		    // check for ampersand operator
			} else if(/&/g.test(prop)) {
				if(/, ?/g.test(prop) && options.combineSelectors) {
					var parts = prop.replace(/, /g, ',').split(',');
					for(var i=0; i<parts.length, p=parts[i]; i++) {
						if(p.indexOf('&') >= 0) {
							addRule(p.replace(/&/g, selector), _objects[prop], stylesheet, parentSelector);
						} else {
							addRule(p, _objects[prop], stylesheet, typeof parentSelector !== "undefined" ? parentSelector + " " + selector : selector);
						}
					}
				} else {
					addRule(prop.replace(/&/g, selector), _objects[prop], stylesheet, parentSelector);
				}
			// check for media query
			} else if(prop.indexOf("@media") === 0 || prop.indexOf("@supports") === 0) {
				addRule(selector, _objects[prop], prop, parentSelector);
			// check for media query
			} else if(selector.indexOf("@media") === 0 || prop.indexOf("@supports") === 0) {
				addRule(prop, _objects[prop], selector, parentSelector);
			// moving the selector to the top of the chain
			} else if(selector.indexOf("^") === 0) {
				// selector, props, stylesheet, parentSelector
				addRule(
					selector.substr(1, selector.length-1) + (typeof parentSelector !== "undefined" ? " " + parentSelector : '') + " " + prop,
					_objects[prop], 
					stylesheet
				);
			// check for plugins
			} else if(checkAndExecutePlugin(selector, prop, _objects[prop], stylesheet, parentSelector) === false) {
				addRule(prop, _objects[prop], stylesheet, (parentSelector ? parentSelector + " " : "") + selector);
			}
		}

		for(var prop in _functions) {
			var o = {};
			o[prop] = _functions[prop]();
			addRule(selector, o, stylesheet, parentSelector);
		}
		
	}

	var add = function(rules, stylesheet, opts) {

		if(API.jsonify) {
			extend(API.getRules(stylesheet || 'mainstream'), rules);
			return API;
		}

		try {

			toRegister = [];
			API.numOfAddedRules += 1;

			if(typeof stylesheet === 'object' && typeof opts === 'undefined') {
				options = {
					combineSelectors: typeof stylesheet.combineSelectors != 'undefined' ? stylesheet.combineSelectors : options.combineSelectors,
					preventCombining: options.preventCombining.concat(stylesheet.preventCombining || [])
				};
				stylesheet = null;
			}
			if(typeof opts != 'undefined') {
				options = {
					combineSelectors: opts.combineSelectors || options.combineSelectors,
					preventCombining: options.preventCombining.concat(opts.preventCombining || [])
				};
			}

			var typeOfPreprocessor = API.defaultProcessor.type, uid;

			for(var selector in rules) {
				addRule(selector, rules[selector], stylesheet || "mainstream");
			}

			// looping through the rules for registering
			for(var i=0; i<toRegister.length; i++) {
				var stylesheet = toRegister[i].stylesheet,
					selector = toRegister[i].selector,
					props = toRegister[i].props,
					allRules = API.getRules(stylesheet);
				var pc = options && options.preventCombining ? '|' + options.preventCombining.join('|') : '';
				var uid = pc.indexOf('|' + selector.replace(/^%.*?%/, '')) >= 0 ? '~~' + API.numOfAddedRules + '~~' : '';
				// overwrite already added value
				var current = allRules[uid + selector] || {};
				for(var propNew in props) {
					var value = props[propNew];
					propNew = uid + propNew;
					if(typeof value != 'object') {
						if(typeOfPreprocessor == "css") {
							// appending values
							if(value.toString().charAt(0) === "+") {
								if(current && current[propNew]) {
									current[propNew] = current[propNew] + ", " + value.substr(1, value.length-1);	
								} else {
									current[propNew] = value.substr(1, value.length-1);	
								}
							} else if(value.toString().charAt(0) === ">") {
								if(current && current[propNew]) {
									current[propNew] = current[propNew] + " " + value.substr(1, value.length-1);	
								} else {
									current[propNew] = value.substr(1, value.length-1);	
								}
							} else {
								current[propNew] = value;
							}
						} else {
							current[propNew] = value;
						}
						
					}
				}
				allRules[uid + selector] = current;
			}

		return API;

		} catch(err) {
			throw new Error("Error adding: " + JSON.stringify({rules: rules, error: err.toString()}));
		}
	}
	return add;
}

var extend = require("../helpers/Extend");

lib.api.compile = function(api) {
	return function() {
		var path = null, callback = function() {}, options = null;
		for(var i=0; i<arguments.length; i++) {
			switch(typeof arguments[i]) {
				case "function": callback = arguments[i]; break;
				case "string": path = arguments[i]; break;
				case "object": options = arguments[i]; break;
			}
		}

		var _defaultOptions = {
			combineSelectors: true,
			minify: false,
			keepCamelCase: false,
			processor: api.defaultProcessor,
			api: api
		};
		options = extend(_defaultOptions, options || {});

		return options.processor(
			api.getRules(),
			function(err, result) {
				if(path != null) {
					try {
						var fileContent = result;
						if('object' === typeof fileContent) {
							fileContent = JSON.stringify(fileContent);
						}
						fs.writeFile(path, fileContent, function (err) {
							callback(err, result);
						});
					} catch(err) {
						callback.apply({}, arguments);
					}
				} else {
					callback.apply({}, arguments);
				}
				api.flush();
			},
			options
		);
		
	}
}

lib.api.compileFile = function(api) {
	return api.compile;
}
var ColorLuminance = function (hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
};
lib.api.darken = function(api) {
	return function(color, percents) {
		return ColorLuminance(color, -(percents/100));
	}
}
lib.api.define = function(api) {
	return function(prop, value) {
		if(!api.getStorage().__defined) api.getStorage().__defined = {};
		api.getStorage().__defined[prop] = value;
		return api;
	}
}
lib.api.hook = function(api) {
	return function(method, callback) {
		api.addHook(method, callback);
		return api;
	}
}
lib.api.importCSS = function(api) {
	var CSSParse = require("../helpers/CSSParse");
	return function(cssData) {
		try {
			var parsed = CSSParse(cssData);
			api.handlecss(parsed, '');
		} catch(err) {
			console.log("Error in the CSS:  '" + cssData + "'", err, err.stack);
		}
		return api;
	}
}
var ColorLuminance = function (hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
};
lib.api.lighten = function(api) {
	return function(color, percents) {
		return ColorLuminance(color, percents/100);
	}
}
var metamorphosis = {
	html: function(api) {
		api.defaultProcessor = require(__dirname + "/../processors/html/HTML.js")();
		api.hook("add", function(tags, template) {
			api.getRules(template || "mainstream").push(tags);
			return true;
		});
	},
	component: function(api) {
		api.defaultProcessor = require(__dirname + "/../processors/component/Component.js")();
		api.hook("add", function(component) {
			if(!(component instanceof Array)) component = [component];
			for(var i=0; i<component.length, c = component[i]; i++) {
				api.getRules("mainstream").push(c);
			}
			return true;
		});	
	},
	jsonify: function(api) {
		api.jsonify = true;
	},
	'dynamic-css': function(api) {
		api.dynamicCSS = true;
	}
}
lib.api.morph = function(api) {
	return function(type) {
		if(metamorphosis[type]) {
			api.flush();
			metamorphosis[type](api);
		}
		return api;
	}
}
lib.api.plugin = function(api) {
	var plugin = function(name, func) {
		api.getPlugins()[name] = func;
		return api;
	}
	return plugin;	
}
lib.api.raw = function(api) {
	return function(raw) {
		var o = {}, v = {};
		var id = "____raw_" + api.numOfAddedRules;
		v[id] = raw;
		o[id] = v;
		api.add(o);
		return api;
	}
}
var fs = require("fs"),
	path = require("path");

lib.api.rawImport = function(API) {
	
	var importFile = function(path) {
		var fileContent = fs.readFileSync(path, {encoding: "utf8"});
		API.raw(fileContent);
	}
	
	return function(path) {
		var p, _i, _len;
		if (typeof path === 'string') {
			importFile(path);
		} else {
			for (_i = 0, _len = path.length; _i < _len; _i++) {
				p = path[_i];
				importFile(p);
			}
		}
		return API;
    };
}

lib.api.register = function(api) {
	return function(method, func) {
		api[method] = func;
		return api;
	}
}
lib.api.storage = function(API) {
	var _s = API.getStorage();
	var storage = function(name, value) {
		if(typeof value !== "undefined") {
			_s[name] = value;
		} else if(typeof name === "object") {
			for(var _name in name) {
				if(Object.prototype.hasOwnProperty.call(name, _name)) {
					storage(_name, name[_name]);
				}
			}
    } else {
			if(_s[name]) {
				return _s[name];
			} else {
				throw new Error("There is no data in the storage associated with '" + name + "'");
			}
		}
		return API;
	}
	return storage;
}
// Module by visionmedia
// https://github.com/reworkcss/css-parse
//
// http://www.w3.org/TR/CSS21/grammar.html
// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
var commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g

lib.helpers.CSSParse = function(css, options){
  options = options || {};
  options.position = options.position === false ? false : true;

  /**
   * Positional.
   */

  var lineno = 1;
  var column = 1;

  /**
   * Update lineno and column based on `str`.
   */

  function updatePosition(str) {
    var lines = str.match(/\n/g);
    if (lines) lineno += lines.length;
    var i = str.lastIndexOf('\n');
    column = ~i ? str.length - i : column + str.length;
  }

  /**
   * Mark position and patch `node.position`.
   */

  function position() {
    var start = { line: lineno, column: column };
    if (!options.position) return positionNoop;

    return function(node){
      node.position = new Position(start);
      whitespace();
      return node;
    };
  }

  /**
   * Store position information for a node
   */

  function Position(start) {
    this.start = start;
    this.end = { line: lineno, column: column };
    this.source = options.source;
  }

  /**
   * Non-enumerable source string
   */

  Position.prototype.content = css;

  /**
   * Return `node`.
   */

  function positionNoop(node) {
    whitespace();
    return node;
  }

  /**
   * Error `msg`.
   */

  function error(msg) {
    var err = new Error(msg + ' near line ' + lineno + ':' + column);
    err.filename = options.source;
    err.line = lineno;
    err.column = column;
    err.source = css;
    throw err;
  }

  /**
   * Parse stylesheet.
   */

  function stylesheet() {
    return {
      type: 'stylesheet',
      stylesheet: {
        rules: rules()
      }
    };
  }

  /**
   * Opening brace.
   */

  function open() {
    return match(/^{\s*/);
  }

  /**
   * Closing brace.
   */

  function close() {
    return match(/^}/);
  }

  /**
   * Parse ruleset.
   */

  function rules() {
    var node;
    var rules = [];
    whitespace();
    comments(rules);
    while (css.length && css.charAt(0) != '}' && (node = atrule() || rule())) {
      rules.push(node);
      comments(rules);
    }
    return rules;
  }

  /**
   * Match `re` and return captures.
   */

  function match(re) {
    var m = re.exec(css);
    if (!m) return;
    var str = m[0];
    updatePosition(str);
    css = css.slice(str.length);
    return m;
  }

  /**
   * Parse whitespace.
   */

  function whitespace() {
    match(/^\s*/);
  }

  /**
   * Parse comments;
   */

  function comments(rules) {
    var c;
    rules = rules || [];
    while (c = comment()) rules.push(c);
    return rules;
  }

  /**
   * Parse comment.
   */

  function comment() {
    var pos = position();
    if ('/' != css.charAt(0) || '*' != css.charAt(1)) return;

    var i = 2;
    while ("" != css.charAt(i) && ('*' != css.charAt(i) || '/' != css.charAt(i + 1))) ++i;
    i += 2;

    if ("" === css.charAt(i-1)) {
      return error('End of comment missing');
    }

    var str = css.slice(2, i - 2);
    column += 2;
    updatePosition(str);
    css = css.slice(i);
    column += 2;

    return pos({
      type: 'comment',
      comment: str
    });
  }

  /**
   * Parse selector.
   */

  function selector() {
    var m = match(/^([^{]+)/);
    if (!m) return;
    /* @fix Remove all comments from selectors
     * http://ostermiller.org/findcomment.html */
    return trim(m[0]).replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, '').split(/\s*,\s*/);
  }

  /**
   * Parse declaration.
   */

  function declaration() {
    var pos = position();

    // prop
    var prop = match(/^(\*?[-#\/\*\w]+(\[[0-9a-z_-]+\])?)\s*/);
    if (!prop) return;
    prop = trim(prop[0]);

    // :
    if (!match(/^:\s*/)) return error("property missing ':'");

    // val
    var val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);
    if (!val) return error('property missing value');

    var ret = pos({
      type: 'declaration',
      property: prop.replace(commentre, ''),
      value: trim(val[0]).replace(commentre, '')
    });

    // ;
    match(/^[;\s]*/);

    return ret;
  }

  /**
   * Parse declarations.
   */

  function declarations() {
    var decls = [];

    if (!open()) return error("missing '{'");
    comments(decls);

    // declarations
    var decl;
    while (decl = declaration()) {
      decls.push(decl);
      comments(decls);
    }

    if (!close()) return error("missing '}'");
    return decls;
  }

  /**
   * Parse keyframe.
   */

  function keyframe() {
    var m;
    var vals = [];
    var pos = position();

    while (m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/)) {
      vals.push(m[1]);
      match(/^,\s*/);
    }

    if (!vals.length) return;

    return pos({
      type: 'keyframe',
      values: vals,
      declarations: declarations()
    });
  }

  /**
   * Parse keyframes.
   */

  function atkeyframes() {
    var pos = position();
    var m = match(/^@([-\w]+)?keyframes */);

    if (!m) return;
    var vendor = m[1];

    // identifier
    var m = match(/^([-\w]+)\s*/);
    if (!m) return error("@keyframes missing name");
    var name = m[1];

    if (!open()) return error("@keyframes missing '{'");

    var frame;
    var frames = comments();
    while (frame = keyframe()) {
      frames.push(frame);
      frames = frames.concat(comments());
    }

    if (!close()) return error("@keyframes missing '}'");

    return pos({
      type: 'keyframes',
      name: name,
      vendor: vendor,
      keyframes: frames
    });
  }

  /**
   * Parse supports.
   */

  function atsupports() {
    var pos = position();
    var m = match(/^@supports *([^{]+)/);

    if (!m) return;
    var supports = trim(m[1]);

    if (!open()) return error("@supports missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@supports missing '}'");

    return pos({
      type: 'supports',
      supports: supports,
      rules: style
    });
  }

  /**
   * Parse host.
   */

  function athost() {
    var pos = position();
    var m = match(/^@host */);

    if (!m) return;

    if (!open()) return error("@host missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@host missing '}'");

    return pos({
      type: 'host',
      rules: style
    });
  }

  /**
   * Parse media.
   */

  function atmedia() {
    var pos = position();
    var m = match(/^@media *([^{]+)/);

    if (!m) return;
    var media = trim(m[1]);

    if (!open()) return error("@media missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@media missing '}'");

    return pos({
      type: 'media',
      media: media,
      rules: style
    });
  }

  /**
   * Parse paged media.
   */

  function atpage() {
    var pos = position();
    var m = match(/^@page */);
    if (!m) return;

    var sel = selector() || [];

    if (!open()) return error("@page missing '{'");
    var decls = comments();

    // declarations
    var decl;
    while (decl = declaration()) {
      decls.push(decl);
      decls = decls.concat(comments());
    }

    if (!close()) return error("@page missing '}'");

    return pos({
      type: 'page',
      selectors: sel,
      declarations: decls
    });
  }

  /**
   * Parse document.
   */

  function atdocument() {
    var pos = position();
    var m = match(/^@([-\w]+)?document *([^{]+)/);
    if (!m) return;

    var vendor = trim(m[1]);
    var doc = trim(m[2]);

    if (!open()) return error("@document missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@document missing '}'");

    return pos({
      type: 'document',
      document: doc,
      vendor: vendor,
      rules: style
    });
  }

  /**
   * Parse font-face.
   */

  function atfontface() {
    var pos = position();
    var m = match(/^@font-face */);
    if (!m) return;

    if (!open()) return error("@font-face missing '{'");
    var decls = comments();

    // declarations
    var decl;
    while (decl = declaration()) {
      decls.push(decl);
      decls = decls.concat(comments());
    }

    if (!close()) return error("@font-face missing '}'");

    return pos({
      type: 'font-face',
      declarations: decls
    });
  }

  /**
   * Parse import
   */

  var atimport = _compileAtrule('import');

  /**
   * Parse charset
   */

  var atcharset = _compileAtrule('charset');

  /**
   * Parse namespace
   */

  var atnamespace = _compileAtrule('namespace');

  /**
   * Parse non-block at-rules
   */


  function _compileAtrule(name) {
    var re = new RegExp('^@' + name + ' *([^;\\n]+);');
    return function() {
      var pos = position();
      var m = match(re);
      if (!m) return;
      var ret = { type: name };
      ret[name] = m[1].trim();
      return pos(ret);
    }
  }

  /**
   * Parse at rule.
   */

  function atrule() {
    if (css[0] != '@') return;

    return atkeyframes()
      || atmedia()
      || atsupports()
      || atimport()
      || atcharset()
      || atnamespace()
      || atdocument()
      || atpage()
      || athost()
      || atfontface();
  }

  /**
   * Parse rule.
   */

  function rule() {
    var pos = position();
    var sel = selector();

    if (!sel) return error('selector missing');
    comments();

    return pos({
      type: 'rule',
      selectors: sel,
      declarations: declarations()
    });
  }

  return stylesheet();
};

/**
 * Trim `str`.
 */

function trim(str) {
  return str ? str.replace(/^\s+|\s+$/g, '') : '';
}
lib.helpers.Clone = function clone(item) {
    if (!item) { return item; } // null, undefined values check

    var types = [ Number, String, Boolean ], 
        result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    for(var i=0; i<types.length; i++) {
        var type = types[i];
        if(item instanceof type) {
            result = type( item );
        }
    }

    if (typeof result == "undefined") {
        if (Object.prototype.toString.call( item ) === "[object Array]") {
            result = [];
            item.forEach(function(child, index, array) { 
                result[index] = clone( child );
            });
        } else if (typeof item == "object") {
            // testing that this is DOM
            if (item.nodeType && typeof item.cloneNode == "function") {
                var result = item.cloneNode( true );    
            } else if (!item.prototype) { // check that this is a literal
                if (item instanceof Date) {
                    result = new Date(item);
                } else {
                    // it is an object literal
                    result = {};
                    for (var i in item) {
                        result[i] = clone( item[i] );
                    }
                }
            } else {
                // depending what you would like here,
                // just keep the reference, or create new object
                if (false && item.constructor) {
                    // would not advice to do that, reason? Read below
                    result = new item.constructor();
                } else {
                    result = item;
                }
            }
        } else {
            result = item;
        }
    }

    return result;
}
// credits: http://www.sitepoint.com/javascript-generate-lighter-darker-color/
lib.helpers.ColorLuminance = function (hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}
lib.helpers.Extend = function() {
	var process = function(destination, source) {	
	    for(var key in source) {
			if(Object.prototype.hasOwnProperty.call(source, key)) {
			    destination[key] = source[key];
			}
	    }
	    return destination;
	};
	var result = arguments[0];
	for(var i=1; i<arguments.length; i++) {
		result = process(result, arguments[i]);
	}
	return result;
}
// http://docs.emmet.io/css-abbreviations/vendor-prefixes/ (w: webkit, m: moz, s: ms, o: o)
var prefixExtract = function(prop) {
	var result, match;
	if((match = prop.match(/^\-(w|m|s|o)+\-/) || prop.charAt(0) === '-') && !prop.match(/^\-(webkit|moz|ms)+\-/)) {
		if(match !== null && match[0]) {
			result = { prefix: match[0].replace(/-/g, '') }
			result.prop = prop.replace(match[0], '');
		} else {
			result = { prefix: '' }
			result.prop = prop.substr(1, prop.length);
		}
	} else {
		result = {
			prefix: false,
			prop: prop
		}
	}
	return result;
}
lib.helpers.Prefixes = {
	addPrefixes: function(prop, obj) {
		var originalProp = prop, p = prefixExtract(prop), value = obj[prop];
		if(p.prefix !== false) {
			delete obj[originalProp];
			obj[p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('w') >= 0)
				obj['-webkit-' + p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('m') >= 0)
				obj['-moz-' + p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('s') >= 0)
				obj['-ms-' + p.prop] = value;
			if(p.prefix === '' || p.prefix.indexOf('o') >= 0)
				obj['-o-' + p.prop] = value;
		}
	},
	nonPrefixProp: function(prop) {
		var p = prefixExtract(prop);
		if(p.prefix !== false) {
			if(p.prefix == '') { 
				p.prefix = '-';
			} else {
				p.prefix = '-' + p.prefix + '-'; 
			}
		}
		return p;
	}
}
lib.helpers.RequireUncached = function(module) {
	delete require.cache[require.resolve(module)]
    return require(module);
}
lib.helpers.TransformUppercase = function(prop, options) {
	var transformed = "";
	for(var i=0; c=prop.charAt(i); i++) {
		if(c === c.toUpperCase() && c.toLowerCase() !== c.toUpperCase()) {
			transformed += "-" + c.toLowerCase();
		} else {
			transformed += c;
		}
	}
	return transformed;
}
var compileComponent = function(input, callback, options) {

	var css = "", 
		html = "", 
		all = [],
		api = options.api;
		cssPreprocessor = require(__dirname + "/../css/CSS.js")(),
		htmlPreprocessor = require(__dirname + "/../html/HTML.js")();

	var processCSS = function(clb) {
		for(var i=0; i<all.length, component=all[i]; i++) {
			if(typeof component === "function") { component = component(); }
			api.add(component.css ? component.css : {});
		}
		cssPreprocessor(api.getRules(), function(err, result) {
			css += result;
			clb(err);
		}, options);
	}
	var processHTML = function(clb) {
		var index = 0;
		var error = null;
		var processComponent = function() {
			if(index > input.length-1) {
				clb(error);
				return;
			}
			var c = input[index];
			if(typeof c === "function") { c = c(); }
			api.morph("html").add(c.html ? c.html : {});
			htmlPreprocessor(api.getRules(), function(err, result) {
				html += result;
				index += 1;
				error = err;
				processComponent();
			}, options);
		}
		processComponent();
	}
	var checkForNesting = function(o) {
		for(var key in o) {
			if(key === "_include") {
				if(o[key] instanceof Array) {
					for(var i=0; i<o[key].length, c=o[key][i]; i++) {
						if(typeof c === "function") { c = c(); }
						all.push(c);
						checkForNesting(c);
					}
				} else {
					if(typeof o[key] === "function") { o[key] = o[key](); }
					all.push(o[key]);
					checkForNesting(o[key]);
				}
			} else if(typeof o[key] === "object") {
				checkForNesting(o[key]);
			}
		}
	}

	// Checking for nesting. I.e. collecting the css and html.
	for(var i=0; i<input.length, c=input[i]; i++) {
		if(typeof c === "function") { c = c(); }
		all.push(c);
		checkForNesting(c);
	}

	api.flush();
	processCSS(function(errCSS) {
		api.morph("html");
		processHTML(function(errHTML) {
			callback(
				errCSS || errHTML ? {error: {css: errCSS, html: errHTML }} : null,
				css,
				html
			)
		});
	});
	
}
lib.processors.component.Component = function() {
	var processor = function(rules, callback, options) {
		compileComponent(rules.mainstream, callback, options);
	}
	processor.type = "component";
	return processor;
}
var newline = '\n',
	defaultOptions = {
		combineSelectors: true,
		minify: false,
		keepCamelCase: false
	},
	transformUppercase = require("../../helpers/TransformUppercase"),
	extend = require("../../helpers/Extend");

var toCSS = function(rules, options, indent) {
	var css = '';
	indent = indent || ['', '  '];
	for(var selector in rules) {
		// handling raw content
		if(selector.indexOf("____raw") === 0) {
			css += rules[selector][selector] + newline;
		// handling normal styles
		} else {
			var entityStyle = indent[0] + selector.replace(/~~(.+)~~/, '').replace(/^%.*?%/, '') + ' {' + newline;
			var entity = '';
			for(var prop in rules[selector]) {
				var value = rules[selector][prop];
				if(value === "") {
					value = '""';
				}
				prop = prop.replace(/~~(.+)~~/, '').replace(/^%.*?%/, '');
				if(options && options.keepCamelCase === true) {
					entity += indent[1] + prop + ': ' + value + ';' + newline;
				} else {
					entity += indent[1] + transformUppercase(prop) + ': ' + value + ';' + newline;
				}
			}
			if(entity != '') {
				entityStyle += entity;
				entityStyle += indent[0] + '}' + newline;
				css += entityStyle;
			}
		}
	}
	return css;
}

var toJSON = function(rules, options) {
	var result = {};
	for(var stylesheet in rules) {
		var styles = rules[stylesheet];
		if(stylesheet == 'mainstream') {
			for(var selector in styles) {
				result[selector] = {}
				for(var prop in styles[selector]) {
					result[selector][prop] = styles[selector][prop];
				}
			}			
		} else if(stylesheet.indexOf('@media') >= 0) {
			result[stylesheet] = {};
			for(var selector in styles) {
				result[stylesheet][selector] = {}
				for(var prop in styles[selector]) {
					result[stylesheet][selector][prop] = styles[selector][prop];
				}
			}
		}
	}
	return result;
}

// combining selectors
var combineSelectors = function(rules, preventCombining) {

	var map = [], arr = {};
	var preventCombining = [].concat(preventCombining || []);
	preventCombining.splice(0, 0, '');
	preventCombining = preventCombining.join('|');

	// extracting every property
	for(var selector in rules) {
		var props = rules[selector];
		for(var prop in props) {
			map.push({
				selector: selector, 
				prop: prop, 
				value: props[prop], 
				combine: preventCombining.indexOf('|' + prop) < 0 && selector.indexOf('@font-face') < 0
			});
		}
	}

	// combining
	for(var i=0; i<map.length; i++) {
		if(map[i].combine === true && map[i].selector !== false) {
			for(var j=i+1;j<map.length; j++) {
				if(map[i].prop === map[j].prop && map[i].value === map[j].value) {
					map[i].selector += ', ' + map[j].selector.replace(/~~(.+)~~/, '').replace(/^%.*?%/, '');
					map[j].selector = false; // marking for removal
				}
			}
		}
	}

	// preparing the result
	for(var i=0; i<map.length; i++) {
		if(map[i].selector !== false) {
			if(!arr[map[i].selector]) arr[map[i].selector] = {}
			arr[map[i].selector][map[i].prop] = map[i].value;
		}
	}
	
	return arr;
}

var minimize = function(content) {
    content = content.replace( /\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '' );
    // now all comments, newlines and tabs have been removed
    content = content.replace( / {2,}/g, ' ' );
    // now there are no more than single adjacent spaces left
    // now unnecessary: content = content.replace( /(\s)+\./g, ' .' );
    content = content.replace( / ([{:}]) /g, '$1' );
    content = content.replace( /([;,]) /g, '$1' );
    content = content.replace( / !/g, '!' );
    return content;
}

var replaceDefined = function(css, options) {
	if(options && options.api && options.api.getStorage().__defined) {
		var storage = options.api.getStorage().__defined;
		for(var prop in storage) {
			var re = new RegExp('<%( )?' + prop + '( )?%>', 'g');
			if(typeof storage[prop] != 'function') {
				css = css.replace(re, storage[prop]);
			} else {
				css = css.replace(re, storage[prop]());
			}
		}
	}
	return css;
}

lib.processors.css.CSS = function() {
	var processor = function(rules, callback, options) {
		options = options || defaultOptions;
		if(options.api && options.api.jsonify) {
			var json = toJSON(rules, options);
			callback(null, json);
			return json;
		}
		var css = '';
		for(var stylesheet in rules) {
			var r = rules[stylesheet];
			r = options.combineSelectors ? combineSelectors(r, options.preventCombining) : r;
			if(stylesheet === "mainstream") {
				css += toCSS(r, options);
			} else {
				css += stylesheet + " {" + newline + toCSS(r, options, ['  ', '    ']) + "}" + newline;
			}		
		}
		css = replaceDefined(css, options);
		// Dynamic CSS
		if(options && options.api && options.api.dynamicCSS) {
			css = require("../html/helpers/TemplateEngine")(css, options);
		}
		// Minification
		if(options.minify) {
			css = minimize(css);
			if(callback) callback(null, css);
		} else {
			if(callback) callback(null, css);
		}
		return css;
	}
	processor.type = "css";
	return processor;
}

lib.processors.css.plugins.charset = function() {	
	return function(api, charsetValue) {
		if(typeof charsetValue === "string") {
			api.raw("@charset: \"" + charsetValue + "\";");
		} else if(typeof charsetValue === "object") {
			charsetValue = charsetValue.charset.replace(/:/g, '').replace(/'/g, '').replace(/"/g, '').replace(/ /g, '');
			api.raw("@charset: \"" + charsetValue + "\";");
		}
	}
}
lib.processors.css.plugins.document = function() {	
	return function(api, value) {
		if(typeof value === "object") {
			var stylesheet = '';
			stylesheet += '@' + value.vendor + 'document';
			stylesheet += ' ' + value.document;
			if(value.rules && value.rules.length) {
				for(var i=0; rule=value.rules[i]; i++) {
					api.handlecssrule(rule, stylesheet);
				}
			} else if(typeof value.styles != "undefined") {
				api.add(value.styles, stylesheet);
			}
		}
	}
}
lib.processors.css.plugins.keyframes = function() {
	return function(api, value) {
		var processor = require(__dirname + "/../CSS.js")();
		var prefixes = require(__dirname + "/../../../helpers/Prefixes");
		if(typeof value === "object") {
			// js or json
			var frames;
			if(typeof value.frames != "undefined") {
				frames = value.frames;
			// css
			} else if(typeof value.keyframes != "undefined") {
				frames = {};
				for(var i=0; rule=value.keyframes[i]; i++) {
					if(rule.type === "keyframe") {
						var f = frames[rule.values] = {};
						for(var j=0; declaration=rule.declarations[j]; j++) {
							if(declaration.type === "declaration") {
								f[declaration.property] = declaration.value;
							}
						}
					}
				}
			}
			if(api.jsonify) {
				var r = {};
				r.keyframes = {
					name: value.name,
					frames: frames
				}
				api.add(r);
			} else {
				var absurd = require(__dirname + '/../../../../')();
				absurd.add(frames).compile(function(err, css) {
					var content = '@keyframes ' + value.name + " {\n";
					content += css;
					content += "}";
					content = content + "\n" + content.replace("@keyframes", "@-webkit-keyframes");
					api.raw(content);
				}, {combineSelectors: false});	
			}			
		}
	}
}
lib.processors.css.plugins.media = function() {
	return function(api, value) {
		var processor = require(__dirname + "/../CSS.js")();
		if(typeof value === "object") {
			var content = '@media ' + value.media + " {\n";
			var rules = {}, json = {};
			for(var i=0; rule=value.rules[i]; i++) {
				var
					r, rjson;
				if (rule.selectors) {
					r = rules[rule.selectors.toString()] = {};
					rjson = json[rule.selectors.toString()] = {};
					if(rule.type === "rule") {
						for(var j=0; declaration=rule.declarations[j]; j++) {
							if(declaration.type === "declaration") {
								r[declaration.property] = declaration.value;
								rjson[declaration.property] = declaration.value;
							}
						}
					}
				}
				
			}
			content += processor({mainstream: rules});
			content += "}";
			if(api.jsonify) {
				api.add(json, '@media ' + value.media);
			} else {
				api.raw(content);
			}
		}
	}
}
lib.processors.css.plugins.namespace = function() {	
	return function(api, value) {
		if(typeof value === "string") {
			api.raw("@namespace: \"" + value + "\";");
		} else if(typeof value === "object") {
			value = value.namespace.replace(/: /g, '').replace(/'/g, '').replace(/"/g, '').replace(/ /g, '').replace(/:h/g, 'h');
			api.raw("@namespace: \"" + value + "\";");
		}
	}
}
lib.processors.css.plugins.page = function() {	
	return function(api, value) {
		if(typeof value === "object") {
			var content = ""; 
			if(value.selectors.length > 0) {
				content += "@page " + value.selectors.join(", ") + " {\n";
			} else {
				content += "@page {\n";
			}
			for(var i=0; declaration=value.declarations[i]; i++) {
				if(declaration.type == "declaration") {
					content += "  " + declaration.property + ": " + declaration.value + ";\n";
				}
			}
			content += "}";
			api.raw(content);
		}
	}
}
lib.processors.css.plugins.supports = function() {
	return function(api, value) {
		var processor = require(__dirname + "/../CSS.js")();
		if(typeof value === "object") {
			var content = '@supports ' + value.supports + " {\n";
			var rules = {};
			for(var i=0; rule=value.rules[i]; i++) {				
				var r = rules[rule.selectors.toString()] = {};
				if(rule.type === "rule") {
					for(var j=0; declaration=rule.declarations[j]; j++) {
						if(declaration.type === "declaration") {
							r[declaration.property] = declaration.value;
						}
					}
				}
			}
			content += processor({mainstream: rules});
			content += "}";
			api.raw(content);
		}
	}
}
var data = null,
	newline = '\n',
	defaultOptions = {},
	tags = [],
	beautifyHTML = require('js-beautify').html,
	tu = require("../../helpers/TransformUppercase"),
	passedOptions = {};

var processTemplate = function(templateName) {
	var html = '';
	for(var template in data) {
		if(template == templateName) {
			var numOfRules = data[template].length;
			for(var i=0; i<numOfRules; i++) {
				html += process('', data[template][i]);
			}
		}
	}
	return html;
}
var prepareProperty = function(prop, options) {
	if(options && options.keepCamelCase === true) {
		return prop;
	} else {
		return tu(prop, options);
	}
}
var process = function(tagName, obj) {
	// console.log("------------------------\n", tagName, ">", obj);

	var html = '', attrs = '', childs = '';

	var tagAnalized = require("./helpers/PropAnalyzer")(tagName);
	tagName = tagAnalized.tag;
	if(tagAnalized.attrs != "") {
		attrs += " " + tagAnalized.attrs;
	}

	if(typeof obj === "string" || obj === null) {
		return packTag(tagName, attrs, obj);
	}

	var addToChilds = function(value) {
		if(childs != '') { childs += newline; }
		childs += value;
	}

	var addEventAttribute = function(obj) {
		var addition = [];
		for(var eventName in obj) {
			addition.push(eventName.replace(/^\$/, '') + ':' + obj[eventName]);
		}
		if(addition.length > 0) {
			if(/data-absurd-event/g.test(attrs)) {
				attrs.replace(/data-absurd-event="(.*)"/, 'data-absurd-event="$1,' + addition.join(',') + '"');
			} else {
				attrs += ' data-absurd-event="' + addition.join(',') + '"';
			}
		}
	}

	// process directives
	for(var directiveName in obj) {
		var value = obj[directiveName];
		if(/^\$/.test(directiveName)) {
			addEventAttribute(obj);
		} else {
			switch(directiveName) {
				case "_attrs":
					for(var attrName in value) {
						if(typeof value[attrName] === "function") {
							attrs += " " + prepareProperty(attrName, passedOptions) + "=\"" + value[attrName]() + "\"";
						} else {
							attrs += " " + prepareProperty(attrName, passedOptions) + "=\"" + value[attrName] + "\"";
						}
					}
				break;
				case "_":
					addToChilds(value);
				break;
				case "_tpl": 
					if(typeof value == "string") {
						addToChilds(processTemplate(value));
					} else if(value instanceof Array) {
						var tmp = '';
						for(var i=0; tpl=value[i]; i++) {
							tmp += processTemplate(tpl)
							if(i < value.length-1) tmp += newline;
						}
						addToChilds(tmp);
					}
				break;
				case "_include":
					var tmp = '';
					var add = function(o) {
						if(typeof o === "function") { o = o(); }
						if(o.css && o.html) { o = o.html; } // catching a component
						tmp += process('', o);
					}
					if(value instanceof Array) {
						for(var i=0; i<value.length, o=value[i]; i++) {
							add(o);
						}
					} else if(typeof value === "object"){
						add(value);
					}
					addToChilds(tmp);
				break;
				default:
					switch(typeof value) {
						case "string": addToChilds(process(directiveName, value)); break;
						case "object": 
							if(value && value.length && value.length > 0) {
								var tmp = '';
								for(var i=0; v=value[i]; i++) {
									tmp += process('', typeof v == "function" ? v() : v);
									if(i < value.length-1) tmp += newline;
								}
								addToChilds(process(directiveName, tmp));
							} else {
								addToChilds(process(directiveName, value));
							}
						break;
						case "function": addToChilds(process(directiveName, value())); break;
					}
				break;
			}
		}
	}

	if(tagName != '') {
		html += packTag(tagName, attrs, childs);
	} else {
		html += childs;
	}

	return html;
}
var packTag = function(tagName, attrs, childs) {
	var html = '';
	if(tagName == '' && attrs == '' && childs != '') {
		return childs;
	}
	tagName = tagName == '' ? 'div' : tagName;
	if(childs !== null) {
		html += '<' + prepareProperty(tagName, passedOptions) + attrs + '>' + newline + childs + newline + '</' + prepareProperty(tagName, passedOptions) + '>';
	} else {
		html += '<' + prepareProperty(tagName, passedOptions) + attrs + '/>';
	}
	return html;
}
var prepareHTML = function(html) {
	html = require("./helpers/TemplateEngine")(html.replace(/[\r\t\n]/g, ''), passedOptions);
	if(passedOptions.minify) {
		return html;
	} else {
		return beautifyHTML(html, {indent_size: passedOptions.indentSize || 4});
	}
}
lib.processors.html.HTML = function() {
	var processor = function(rules, callback, options) {
		data = rules;
		callback = callback || function() {};
		options = passedOptions = options || defaultOptions;
		var html = prepareHTML(processTemplate("mainstream"));
		callback(null, html);
		return html;
	}
	processor.type = "html";
	return processor;
}
lib.processors.html.helpers.PropAnalyzer = function(prop) {
	var res = { 
			tag: '',
			attrs: ''
		},
		numOfChars = prop.length,
		tagName = "",
		className = "", readingClass = false, classes = [],
		idName = "", readingId = false, ids = [],
		attributes = "", readingAttributes = false;

	if(/(#|\.|\[|\])/gi.test(prop) === false) {
		return {
			tag: prop,
			attrs: ''
		};
	}

	for(var i=0; i<prop.length, c=prop[i]; i++) {
		if(c === "[" && !readingAttributes) {
			readingAttributes = true;
		} else if(readingAttributes) {
			if(c != "]") {
				attributes += c;
			} else {
				readingAttributes = false;
				i -= 1;
			}
		} else if(c === "." && !readingClass) {
			readingClass = true;
		} else if(readingClass) {
			if(c != "." && c != "#" && c != "[" && c != "]") {
				className += c;
			} else {
				classes.push(className);
				readingClass = false;
				className = "";
				i -= 1;
			}
		} else if(c === "#" && !readingId) {
			readingId = true;
		} else if(readingId) {
			if(c != "." && c != "#" && c != "[" && c != "]") {
				idName += c;
			} else {
				readingId = false;
				i -= 1;
			}
		} else if(c != "." && c != "#" && c != "[" && c != "]") {
			res.tag += c;
		}
	}

	// if ends with a class
	if(className != "") classes.push(className);

	// collecting classes
	var clsStr = '';
	for(var i=0; cls=classes[i]; i++) {
		clsStr += clsStr === "" ? cls : " " + cls;
	}
	res.attrs += clsStr != "" ? 'class="' + clsStr + '"' : '';

	// if ends on id
	if(idName != "") {
		res.attrs += (res.attrs != "" ? " " : "") + 'id="' + idName + '"';
	}

	// if div tag name is skipped
	if(res.tag === "" && res.attrs != "") res.tag = "div";

	// collecting attributes
	if(attributes != "") {
		res.attrs += (res.attrs != "" ? " " : "") + attributes;
	}

	return res;
}
lib.processors.html.helpers.TemplateEngine = function(html, options) {
	var re = /<%(.+?)%>/g, 
		reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g, 
		code = 'with(obj) { var r=[];\n', 
		cursor = 0, 
		result;
	var add = function(line, js) {
		js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
			(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
		return add;
	}
	while(match = re.exec(html)) {
		add(html.slice(cursor, match.index))(match[1], true);
		cursor = match.index + match[0].length;
	}
	add(html.substr(cursor, html.length - cursor));
	code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, '');
	try { result = new Function('obj', code).apply(options, [options]); }
	catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
	return result;
}