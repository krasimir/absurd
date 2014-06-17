var path = require("path");

module.exports = function(grunt) {

	grunt.initConfig({
		concat: {
			// packing the nodejs code
			absurd: {
				src: [
					'lib/**/*.js',
					'!lib/CLI.js',
					'!lib/API.js',
					'!lib/api/handlecss.js',
					'!lib/api/handlecssrule.js',
					'!lib/api/handlecssimport.js',
					'!lib/api/import.js',
					'!lib/api/express.js',
					'!lib/processors/css/organic/**/*.*',
					'!lib/helpers/CSS2JSON.js'
				],
				dest: 'tasks/tmp/absurd.js',
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
			// packing organic framework
			organic: {
				src: [
					'lib/processors/css/organic/**/*.js'
				],
				dest: 'tasks/tmp/absurd-organic.js',
				options: {
					process: function(src, filepath) {
						var moduleDef = filepath
						.replace(/\//g, '.')
						.replace(/\//g, '.')
						.replace(/\.js/g, '')
						.replace('lib.processors.css.organic', 'o');
						return src.replace("module.exports", moduleDef);
					}
				}
			},
			// packing client side code
			'absurd-client-code': {
				src: [
					'client-side/lib/**/*.js',
				],
				dest: 'tasks/tmp/absurd-client-code.js',
			},
			// packing client side code
			'absurd-organic-client-code': {
				src: [
					'client-side/lib-organic/**/*.js',
				],
				dest: 'tasks/tmp/absurd-organic-client-code.js',
			},
			// packing the nodejs tests for client-side usage
			'node-tests-to-client': {
				src: [
					'tests/common/*.js',
					'tests/bugs/*.js',
					'tests/metamorphosis/**/*.js',
					'tests/componenting/**/*.js',
					'tests/di/*.js',
					'tests/organic/*.js',
					'tests/experimental/move.selector.up.spec.js',
					'tests/experimental/same.property.diff.value.spec.js',
					'tests/experimental/error.reporting.spec.js',
					'tests/experimental/dynamic.css.spec.js',
					'!tests/common/api.import.spec.js',
					'!tests/common/compile-and-save.spec.js',
					'!tests/common/minify.spec.js',
					'!tests/common/using-css.spec.js',
					'!tests/common/using-json.spec.js',
					'!tests/common/using-yaml.spec.js',
					'!tests/common/basics-and-compilation.spec.js',
					'!tests/common/cli.spec.js',
					'!tests/common/variables-and-functions.spec.js',
					'!tests/common/adding-raw-external-data.spec.js',
					'!tests/common/define.external.css.spec.js',
					'!tests/common/return-processed-external-data.spec.js',
					'!tests/metamorphosis/html/morph.html.import.spec.js',
					'!tests/metamorphosis/html/morph.html.indentation.spec.js',
					'!tests/bugs/css.import.multiple.classes.spec.js',
					'!tests/bugs/use.import.in.css.file.spec.js',
					'!tests/experimental/csstojson.spec.js',
					'!tests/bugs/dynamic-css-in-files/*.js'
				],
				dest: 'client-side/tests/tests.from.node.js',
			}
		},
		// building the client-side port of absurd and organic
		build: {
			index: {
				dest: 'client-side/build/absurd.js',
				organicDest: 'client-side/build/absurd.organic.js'
			}
		},
		// minification
		uglify: {
			absurd: {
				src: 'client-side/build/absurd.js',
				dest: 'client-side/build/absurd.min.js'
			},
			organic: {
				src: 'client-side/build/absurd.organic.js',
				dest: 'client-side/build/absurd.organic.min.js'
			}
		},
		// watching
		watch: {
			commands: {
				files: [
					'<%= concat.absurd.src[0] %>',
					'client-side/lib/**/*.js',
					'client-side/lib-organic/**/*.js',
					'tests/**/*.js'
				],
				tasks: ['concat', 'build', 'uglify']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadTasks('tasks');

	grunt.registerTask('default', ['concat', 'build', 'uglify', 'watch']);

}