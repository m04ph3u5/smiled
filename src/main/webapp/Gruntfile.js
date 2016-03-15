module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			dist : {
				options: {
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> Buonaiuto Andrea - Parlato Luigi  */\n',
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
		},
		cssmin : {
			my_target :{
//				options: {
//					banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd")  %> Buonaiuto Andrea - Parlato Luigi */\n',
//					shorthandCompacting: false,
//					roundingPrecision : -1
//				},
//				files : {
//					'assets/public/build/<%= pkg.name %>.min.css' : ['assets/public/css/custom-style.css', 'assets/public/css/secondaryCss.css', 'assets/public/css/storyline.css']
//				}
				files : [{
					expand : true,
					cwd : 'assets/public/css',
					src : ['custom-style.css', 'secondaryCss.css', 'storyline.css'],
					dest : 'assets/public/build',
					ext : '.min.css'
				}]
			}
		
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.registerTask('default', ['uglify','cssmin']);
};