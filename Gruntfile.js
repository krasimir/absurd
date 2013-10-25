var path = require("path");

module.exports = function(grunt) {

	grunt.initConfig({
		concat: {
			templates: {
				src: [
					'tpl/docs/**/*.html'
				],
				dest: 'tpl/docs.html'
			},
			demos: {
				src: [
					'js/demos/**/*.js'
				],
				dest: 'js/demos.js',
				options: {
					process: function(src, filepath) {
						var content = '';
						content += 'if(typeof demos === "undefined") { demos = []; }';
						content += 'demos.push({name: "' + filepath.replace(/\.js/, '').replace("js/demos/", "");
						content += '", content: \'' + src.replace(/\n/g, '\\n').replace(/\r/g, '') + '\'});';
						return content;
					}
				}
			}
		},
		absurd: {
            task: {
                src: __dirname + "/css/absurd/styles.js",
                dest: 'css/styles.css'
            }
        },
		'generate-index': {
			index: {
				src: 'tpl/index.html',
				dest: 'index.html'
			}
		},
		'copy-build-files': {
			index: {
				src: '',
				dest: ''
			}
		},
		watch: {
			gogo: {
				files: [
					'js/**/*.js',
					'!js/absurd.js',
					'!js/absurd.min.js',
					'css/**/*.js',
					'tpl/docs/**/*.html',
					'tpl/index.html',
					'!js/demos.js'
				],
				tasks: ['concat', 'absurd', 'generate-index']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-absurd');
	grunt.loadTasks('tasks');

	grunt.registerTask('default', ['concat', 'absurd', 'generate-index', 'copy-build-files', 'watch']);

}