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