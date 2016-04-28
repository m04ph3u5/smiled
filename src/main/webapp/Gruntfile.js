module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat : {
			dist : {
				src : ['assets/public/js/app.js', 'assets/public/js/router.js', 'assets/public/js/controllers/**/*.js', 'assets/public/js/services/**/*.js', 'assets/public/js/directives/**/*.js', 'assets/public/js/wrapping/**/*.js'],
				dest : "assets/public/build/<%= pkg.name %>.concat.js"
			}
		},
		ngAnnotate: {
			options: {
				singleQuotes: true
			},
	        your_target: {
	            files : {
	            	"assets/public/build/<%= pkg.name %>.min.js" : ["assets/public/build/<%= pkg.name %>.concat.js"],
	            	'assets/public/js/vendor/angular-permission/dist/angular-permission.ann.js' : ['assets/public/js/vendor/angular-permission/dist/angular-permission.js'],
					'assets/public/js/vendor/angular-native-dragdrop/draganddrop.ann.js' : ['assets/public/js/vendor/angular-native-dragdrop/draganddrop.js'],
					'assets/public/js/support/datepicker.ann.js' : ['assets/public/js/support/datepicker.js'],
					'assets/public/js/support/jquery.downCount.ann.js' : ['assets/public/js/support/jquery.downCount.js']
	            }
	        },
	    },
		uglify: {
			dist : {
				options: {
					banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> Buonaiuto Andrea - Parlato Luigi  */\n',
					mangle : false,
					report: 'min'
				},
	//			build: {
	//				src: ['assets/public/js/router.js', 'assets/public/js/controllers/**/*.js', 'assets/public/js/services/**/*.js', 
	//				      'assets/public/js/directives/**/*.js', 'assets/public/js/wrapping/**/*.js', ],
	//				dest: 'assets/public/build/<%= pkg.name %>.min.js'
	//			}
				files : {
					'assets/public/build/<%= pkg.name %>.app.js' : ["assets/public/build/<%= pkg.name %>.min.js"],
					'assets/public/js/vendor/angular-permission/dist/angular-permission.min.js' : ['assets/public/js/vendor/angular-permission/dist/angular-permission.ann.js'],
					'assets/public/js/vendor/angular-native-dragdrop/draganddrop.min.js' : ['assets/public/js/vendor/angular-native-dragdrop/draganddrop.ann.js'],
					'assets/public/js/support/datepicker.min.js' : ['assets/public/js/support/datepicker.ann.js'],
					'assets/public/js/support/jquery.downCount.min.js' : ['assets/public/js/support/jquery.downCount.ann.js']
				}
			}
		},
		cssmin : {
			my_target :{
				options: {
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd")  %> Buonaiuto Andrea - Parlato Luigi */\n',
					shorthandCompacting: false,
					roundingPrecision : -1
				},
				files : {
					'assets/public/css/<%= pkg.name %>.min.css' : ['assets/public/css/custom-style.css', 'assets/public/css/secondaryCss.css', 
					                                               'assets/public/css/storyline.css', 'assets/public/css/validation-form.css',
					                                               'assets/public/js/vendor/ui-slider/slider.css'],
					'assets/public/css/login-style.min.css' : ['assets/public/css/login-style.css']
				}
//				files : [{
//					expand : true,
//					cwd : 'assets/public/css',
//					src : ['custom-style.css', 'secondaryCss.css', 'storyline.css'],
//					dest : 'assets/public/build',
//					ext : '.min.css'
//				}]
			}
		
		}, 
		imagemin : {
			dist : {
				options:{
					optmiizationLevel : 7
				},
				files : [{
					expand : true,
					cwd : 'assets/public/img',
					src : ['**/*.{png,jpg,jpeg,gif}'],
					dest : 'assets/public/img_min'
				}]
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat'); 
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.registerTask('default', ['concat','ngAnnotate','uglify','cssmin']);
};
