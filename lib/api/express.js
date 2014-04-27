var CSSParse = require("../helpers/CSSParse"),
    extend = require("../helpers/Extend"),
    path = require('path'),
    url = require('url'),
    fs = require('fs'),
    htmloptions,
    jsonoptions,
    cssoptions,
    imports = [],
    tempimports = [];

module.exports = function(api) {

  return function(options) {
    if(options === 'addImport')
      return addImport;
    else {
      switch(options.morph) {
        case 'html':
          htmloptions = options;
          return __html;
        case 'jsonify':
          jsonoptions = options;
          return __json;
        default:
          if ('string' === typeof options)
            cssoptions = { src: options };
					else
						cssoptions = options;
          return __css;
      }
    }
  };

  function __html(pathname, options, callback) {
    var mergedoptions = {};
    mergedoptions = extend(mergedoptions, htmloptions, options);
    return api.morph('html').import(pathname).compile(mergedoptions, callback);
  }

  function __json(req, res, next) {
    if ('GET' != req.method.toUpperCase() && 'HEAD' != req.method.toUpperCase()) { return next(); }

    var options = jsonoptions,
        force = options.force ? options.force : false,
        once = options.once ? options.once : false,
        debug = options.debug ? options.debug : false,
        root = options.root ? options.root : false,
        src = options.src ? options.src : '',
        dest = options.dest ? options.dest : src,
        pathname = url.parse(req.url).pathname,
        extpref = options.extpref;

    if(options.prefix && 0 === pathname.indexOf(options.prefix)) {
      pathname = pathname.substring(options.prefix.length);
    }
    if(/\.json$/.test(pathname)) {
      var cssPath = path.join(dest, pathname),
          absurdBasePath = src,
          absurdDir,
          absurdPath;

      if(root) {
        cssPath = path.join(root, dest, pathname.replace(dest, ''));
        absurdBasePath = path.join(root, src);
      }

      if(Array.prototype.isPrototypeOf(extpref)) {
        for(var iter = 0; iter < extpref.length; iter++){
          absurdPath = path.join(absurdBasePath, pathname.replace('.json', '.' + extpref[iter]));
          if(fs.existsSync(absurdPath)){
            break;
          }
        }
      } else if('string' === typeof extpref) {
        absurdPath = path.join(absurdBasePath, pathname.replace('.json', '.' + extpref));
      } else {
        var defextpref = ['js', 'json', 'yaml', 'yml', 'css'];
        for(var iter = 0; iter < defextpref.length; iter++){
          absurdPath = path.join(absurdBasePath, pathname.replace('.json', '.' + defextpref[iter]));
          if(fs.existsSync(absurdPath)){
            break;
          }
        }
      }

      absurdDir = path.dirname(absurdPath);

      if(debug) {
        log('source', absurdPath);
        log('dest', cssPath);
      }

      var error = function(err) {
        next ('ENOENT' === err.code ? null : err);
      };

      var compile = function() {
        if(debug) { log('import', cssPath); }
        api.morph('jsonify').import(absurdPath).compile(cssPath, options, function(err, css) {
          if(err) { return error(err); }
          if(debug) { log('compile', absurdPath); }

          next();

        });
      };

      if(force) { return compile(); }

      if(!imports[absurdPath]) { return compile(); }

      if(once && imports[absurdPath]) { return next(); }

      fs.stat(absurdPath, function(err, absurdStats){
        if(err) { return error(err); }

        fs.stat(cssPath, function(err, cssStats) {
          if(err) {
            if('ENOENT' === err.code) {
              if(debug) { log('not found', cssPath); }
               compile();
            } else {
              next(err);
            }
          } else {
            if(absurdStats.mtime > cssStats.mtime) {
              if(debug) { log('modified', cssPath); }
              compile();
            } else {
              next();
            }
          }
        });
      });
    } else {
      next();
    }
  }

  function __css(req, res, next) {
    if ('GET' != req.method.toUpperCase() && 'HEAD' != req.method.toUpperCase()) { return next(); }

    var options = cssoptions,
        force = options.force ? options.force : false,
        once = options.once ? options.once : false,
        debug = options.debug ? options.debug : false,
        root = options.root ? options.root : false,
        src = options.src ? options.src : '',
        dest = options.dest ? options.dest : src,
        pathname = url.parse(req.url).pathname,
        extpref = options.extpref;

    if(options.prefix && 0 === pathname.indexOf(options.prefix)) {
      pathname = pathname.substring(options.prefix.length);
    }
    if(/\.css$/.test(pathname)) {
      var cssPath = path.join(dest, pathname),
          absurdBasePath = src,
          absurdDir,
          absurdPath;

      if(root) {
        cssPath = path.join(root, dest, pathname.replace(dest, ''));
        absurdBasePath = path.join(root, src);
      }

      if(Array.prototype.isPrototypeOf(extpref)) {
        for(var iter = 0; iter < extpref.length; iter++){
          absurdPath = path.join(absurdBasePath, pathname.replace('.css', '.' + extpref[iter]));
          if(fs.existsSync(absurdPath)){
            break;
          }
        }
      } else if('string' === typeof extpref) {
        absurdPath = path.join(absurdBasePath, pathname.replace('.css', '.' + extpref));
      } else {
        var defextpref = ['js', 'json', 'yaml', 'yml', 'css'];
        for(var iter = 0; iter < defextpref.length; iter++){
          absurdPath = path.join(absurdBasePath, pathname.replace('.css', '.' + defextpref[iter]));
          if(fs.existsSync(absurdPath)){
            break;
          }
        }
      }

      absurdDir = path.dirname(absurdPath);

      if(debug) {
        log('source', absurdPath);
        log('dest', cssPath);
      }

      var error = function(err) {
        next ('ENOENT' === err.code ? null : err);
      };

      var compile = function() {
        if(debug) { log('import', cssPath); }

        api.import(absurdPath).compile(cssPath, options, function(err, css) {
          if(err) { return error(err); }
          if(debug) { log('compile', absurdPath); }
          var paths = getImports(absurdPath);

          delete imports[absurdPath];
          imports[absurdPath] = paths;

          next();

        });
      };

      if(force) { return compile(); }

      if(!imports[absurdPath]) { return compile(); }

      if(once && imports[absurdPath]) { return next(); }

      fs.stat(absurdPath, function(err, absurdStats){
        if(err) { return error(err); }

        fs.stat(cssPath, function(err, cssStats) {
          if(err) {
            if('ENOENT' === err.code) {
              if(debug) { log('not found', cssPath); }
               compile();
            } else {
              next(err);
            }
          } else {
            if(absurdStats.mtime > cssStats.mtime) {
              if(debug) { log('modified', cssPath); }
              compile();
            } else {
              checkImports(absurdPath, function(changed){
                if(debug && changed && changed.length) {
                  changed.forEach(function(changedpath) {
                    log('modified import %s', changedpath);
                  });
                }
                changed && changed.length ? compile() : next();
              });
            }
          }
        });
      });
    } else {
      next();
    }
  }

  function log(key, val) {
    console.error(' \033[90m%s :\033[0m \033[36m%s\033[0m', key, val);
  }

  function checkImports(pathname, fn) {
    var nodes = imports[path];
    if(!nodes) { return fn(); }
    if(!nodes.length) { return fn(); }

    var pending = nodes.length,
        changed = [];

    nodes.forEach(function(imported){
      fs.stat(imported.path, function(err, stat) {
        if(err || !imported.mtime || stat.mtime > imported.mtime) {
          changed.push(imported.path);
        }
        --pending || fn(changed);
      });
    });
  }

  function getImports(pathname) {
    var resultArray = [], tempImportObj = {}, importPath = '';

		if(tempimports.length > 0){
			for(var iter=0; iter < tempimports.length; iter++) {
				if( !(resultArray.indexOf(tempimports[iter]) > -1) && ( tempimports[iter] !== pathname)){
					importPath = tempimports[iter];
					tempImportObj.path = importPath;
					tempImportObj.mtime = fs.statSync(importPath).mtime;
					resultArray.push(tempImportObj);
				}
			}
		}

    tempimports = [];
    return resultArray;
  }

  function addImport(importPath) {
    tempimports.push(importPath);
  }
};