var path = require("path");

module.exports = function(grunt) {

	grunt.initConfig({
		concat: {
			absurd: {
				src: [
					'lib/**/*.js',
					'!lib/CLI.js',
					'!lib/API.js'
				],
				dest: 'tmp/absurd.js',
				options: {
					process: function(src, filepath) {
						var moduleDef = filepath
						.replace(/\//g, '.')
						.replace(/\//g, '.')
						.replace(/\.js/g, '');
						return src.replace("module.exports", moduleDef);
					}
				}
			}
		},
		'client-side': {
			index: {
				src: '<%= concat.absurd.dest %>',
				dest: 'build/absurd.js'
			}
		},
		watch: {
			commands: {
				files: [
					'<%= concat.absurd.src[0] %>',
					'tasks/client-side-libs/**/*.js'
				],
				tasks: ['concat', 'client-side']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadTasks('tasks');

	grunt.registerTask('default', ['concat', 'client-side', 'watch']);

}