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