module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			dist : {
				options: {
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
					mangle : false,
					report: 'min'
				},
	//			build: {
	//				src: ['assets/public/js/app.js', 'assets/public/js/router.js', 'assets/public/js/controllers/**/*.js', 'assets/public/js/services/**/*.js', 
	//				      'assets/public/js/directives/**/*.js', 'assets/public/js/wrapping/**/*.js', ],
	//				dest: 'assets/public/build/<%= pkg.name %>.min.js'
	//			}
				files : {
					'assets/public/build/<%= pkg.name %>.min.js' : ['assets/public/js/app.js', 'assets/public/js/router.js', 'assets/public/js/controllers/**/*.js', 'assets/public/js/services/**/*.js', 'assets/public/js/directives/**/*.js', 'assets/public/js/wrapping/**/*.js'],
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['uglify']);
};