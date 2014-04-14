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