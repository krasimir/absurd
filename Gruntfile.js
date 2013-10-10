var path = require("path");

module.exports = function(grunt) {

	grunt.initConfig({
		concat: {
			templates: {
				src: [
					'tpl/docs/**/*.html'
				],
				dest: 'tpl/docs.html'
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
		watch: {
			gogo: {
				files: [
					'js/**/*.js',
					'css/**/*.js',
					'tpl/docs/**/*.html',
					'tpl/index.html'
				],
				tasks: ['concat', 'absurd', 'generate-index']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-absurd');
	grunt.loadTasks('tasks');

	grunt.registerTask('default', ['concat', 'absurd', 'generate-index', 'watch']);

}