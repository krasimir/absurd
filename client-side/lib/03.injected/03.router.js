absurd.di.register('router', {
	routes: [],
	mode: null,
	root: '/',
	getFragment: function() {
		var fragment = '';
		if(this.mode === 'history') {
			if(!location) return '';
			fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
			fragment = fragment.replace(/\?(.*)$/, '');
			fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
		} else {
			if(!window) return '';
			var match = window.location.href.match(/#(.*)$/);
			fragment = match ? match[1] : '';
		}
		return this.clearSlashes(fragment);
	},
    clearSlashes: function(path) {
    	return path.toString().replace(/\/$/, '').replace(/^\//, '');
    },
	add: function(re, handler) {
		if(typeof re == 'function') {
			handler = re;
			re = '';
		}
		this.routes.push({ re: re, handler: handler});
		return this;
	},
	remove: function(param) {
		for(var i=0, r; i<this.routes.length, r = this.routes[i]; i++) {
			if(r.handler === param || r.re === param) {
				this.routes.splice(i, 1); 
				return this;
			}
		}
		return this;
	},
	flush: function() {
		this.routes = [];
		this.mode = null;
		this.root = '/';
		return this;
	},
	config: function(options) {
		this.mode = options && options.mode && options.mode == 'history' && !!(history.pushState) ? 'history' : 'hash';
		this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
		return this;
	},
	listen: function(loopInterval) {
		var self = this;
		var current = self.getFragment();
		var fn = function() {
			if(current !== self.getFragment()) {
				current = self.getFragment();
				self.check(current);
			}
		}
		clearInterval(this.interval);
		this.interval = setInterval(fn, loopInterval || 50);
		return this;
	},
	check: function(f) {
		var fragment = f || this.getFragment();
		for(var i=0; i<this.routes.length; i++) {
			var match = fragment.match(this.routes[i].re);
			if(match) {
				match.shift();
				this.routes[i].handler.apply(this.host || {}, match);
				return this;
			}			
		}
		return this;
	},
	navigate: function(path) {
		path = path ? path : '';
		if(this.mode === 'history') {
			history.pushState(null, null, this.root + this.clearSlashes(path));
		} else {
			window.location.href.match(/#(.*)$/);
			window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
		}
		return this;
	}
});