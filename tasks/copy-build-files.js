'use strict';

var request = require('request');

module.exports = function(grunt) {
    grunt.registerMultiTask('copy-build-files', 'copy build files', function() {

    	var url = "https://raw.github.com/krasimir/absurd/master/client-side/build/absurd.js";
    	var urlMin = "https://raw.github.com/krasimir/absurd/master/client-side/build/absurd.min.js";
    	var organicurl = "https://raw.github.com/krasimir/absurd/master/client-side/build/absurd.organic.js";
    	var organicurlMin = "https://raw.github.com/krasimir/absurd/master/client-side/build/absurd.organic.min.js";

    	var getAbsurd = function(callback) {
	        request.get(url, function (error, response, body) {
			    if (!error && response.statusCode == 200) {
			        grunt.file.write(__dirname + "/../js/absurd.js", body, {});
			        request.get(urlMin, function (error, response, body) {
					    if (!error && response.statusCode == 200) {
					        grunt.file.write(__dirname + "/../js/absurd.min.js", body, {});
					        if(callback) callback();
					    }
					});
			    }
			});
    	}

		var getOrganic = function(callback) {
			request.get(organicurl, function (error, response, body) {
			    if (!error && response.statusCode == 200) {
			        grunt.file.write(__dirname + "/../js/absurd.organic.js", body, {});
			        request.get(organicurlMin, function (error, response, body) {
					    if (!error && response.statusCode == 200) {
					        grunt.file.write(__dirname + "/../js/absurd.organic.min.js", body, {});
					        if(callback) callback();
					    }
					});
			    }
			});
		}

		getAbsurd(getOrganic)

    });
};