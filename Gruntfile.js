var path = require("path");

module.exports = function(grunt) {

	grunt.initConfig({
		concat: {
			absurd: {
				src: [
					'lib/**/*.js',
					'!lib/CLI.js',
					'!lib/API.js',
					'!lib/api/handlecss.js',
					'!lib/api/handlecssrule.js',
					'!lib/api/handlecssimport.js',
					'!lib/api/import.js'
				],
				dest: 'client-side/tmp/absurd.js',
				options: {
					process: function(src, filepath) {
						var moduleDef = filepath
						.replace(/\//g, '.')
						.replace(/\//g, '.')
						.replace(/\.js/g, '');
						return src.replace("module.exports", moduleDef);
					}
				}
			},
			'node-tests-to-client': {
				src: [
					'tests/common/*.js',
					'tests/bugs/*.js',
					'tests/metamorphosis/**/*.js',
					'!tests/common/api.import.spec.js',
					'!tests/common/compile-and-save.spec.js',
					'!tests/common/minify.spec.js',
					'!tests/common/using-css.spec.js',
					'!tests/common/using-json.spec.js',
					'!tests/common/using-yaml.spec.js',
					'!tests/common/basics-and-compilation.spec.js',
					'!tests/common/cli.spec.js',
					'!tests/common/variables-and-functions.spec.js',
					'!tests/metamorphosis/html/morph.html.import.spec.js'
				],
				dest: 'client-side/tests/tests.from.node.js',
			}
		},
		'client-side': {
			index: {
				src: '<%= concat.absurd.dest %>',
				dest: 'client-side/build/absurd.js'
			}
		},
		uglify: {
			absurd: {
				src: 'client-side/build/absurd.js',
				dest: 'client-side/build/absurd.min.js'
			}
		},
		watch: {
			commands: {
				files: [
					'<%= concat.absurd.src[0] %>',
					'client-side/lib/**/*.js',
					'tests/**/*.js'
				],
				tasks: ['concat', 'client-side', 'uglify']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadTasks('tasks');

	grunt.registerTask('default', ['concat', 'client-side', 'uglify', 'watch']);

}