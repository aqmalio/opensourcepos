module.exports = function(grunt) {

    grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		wiredep: {
			task: {
				ignorePath: '../../../public/',
				src: ['application/views/partial/header.php']
			}
		},
		bower_concat: {
			all: {
				mainFiles: {
					'bootstrap-table': [ "src/bootstrap-table.js", "src/bootstrap-table.css", "dist/extensions/export/bootstrap-table-export.js", "dist/extensions/mobile/bootstrap-table-mobile.js", "dist/extensions/sticky-header/bootstrap-table-sticky-header.js", "dist/extensions/sticky-header/bootstrap-table-sticky-header.css"]
				},
				dest: {
					'js': 'tmp/opensourcepos_bower.js',
					'css': 'tmp/opensourcepos_bower.css'
				}
			}
		},
		bowercopy: {
			options: {
				report: false
			},
			targetdistjqueryui: {
				options: {
					srcPrefix: 'public/bower_components/jquery-ui',
					destPrefix: 'public/dist'
				},
				files: {
					'jquery-ui': 'themes/base/jquery-ui.min.css'
				}
			},
			targetdistbootswatch: {
				options: {
					srcPrefix: 'public/bower_components/bootswatch',
					destPrefix: 'public/dist'
				},
				files: {
					bootswatch: '*/'
				}
			},
			targetlicense: {
				options: {
					srcPrefix: './'
				},
				files: {
					'public/license': 'LICENSE'
				}
			}
		},
		cssmin: {
			target: {
				files: {
					'public/dist/<%= pkg.name %>.min.css': ['tmp/opensourcepos_bower.css', 'public/css/*.css', '!public/css/login.css', '!public/css/invoice_email.css', '!public/css/barcode_font.css']
				}
			}
		},
		concat: {
			js: {
				options: {
					separator: ';'
				},
				files: {
					'tmp/<%= pkg.name %>.js': ['tmp/opensourcepos_bower.js', 'public/js/jquery*', 'public/js/*.js']
				}
			},
			sql: {
				options: {
					banner: '-- >> This file is autogenerated from tables.sql and constraints.sql. Do not modify directly << --'
				},
				files: {
					'database/database.sql': ['database/tables.sql', 'database/constraints.sql'],
					'database/migrate_phppos_dist.sql': ['database/tables.sql', 'database/phppos_migrate.sql', 'database/constraints.sql']
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'public/dist/<%= pkg.name %>.min.js': ['tmp/<%= pkg.name %>.js']
				}
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'public/js/*.js'],
			options: {
				// options here to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
				}
			}
		},
		tags: {
			css_header: {
				options: {
					scriptTemplate: '<rel type="text/css" src="{{ path }}"></rel>',
					openTag: '<!-- start css template tags -->',
					closeTag: '<!-- end css template tags -->',
					ignorePath: '../../../public/'
				},
				src: ['public/css/*.css', '!public/css/login.css', '!public/css/invoice_email.css', '!public/css/barcode_font.css'],
				dest: 'application/views/partial/header.php',
			},
			mincss_header: {
				options: {
					scriptTemplate: '<rel type="text/css" src="{{ path }}"></rel>',
					openTag: '<!-- start mincss template tags -->',
					closeTag: '<!-- end mincss template tags -->',
					ignorePath: '../../../public/'
				},
				// jquery-ui must be first or at least before opensourcepos.min.css
				src: ['public/dist/jquery-ui/*.css', 'public/dist/*.css'],
				dest: 'application/views/partial/header.php',
			},
			css_login: {
				options: {
					scriptTemplate: '<rel type="text/css" src="{{ path }}"></rel>',
					openTag: '<!-- start css template tags -->',
					closeTag: '<!-- end css template tags -->',
                    ignorePath: '../../public/'
				},
				src: ['public/css/login.css'],
				dest: 'application/views/login.php'
			},
			js: {
				options: {
					scriptTemplate: '<script type="text/javascript" src="{{ path }}"></script>',
					openTag: '<!-- start js template tags -->',
					closeTag: '<!-- end js template tags -->',
					ignorePath: '../../../public/'
				},
				src: ['public/js/jquery*', 'public/js/*.js'],
				dest: 'application/views/partial/header.php'
			},
			minjs: {
				options: {
					scriptTemplate: '<script type="text/javascript" src="{{ path }}"></script>',
					openTag: '<!-- start minjs template tags -->',
					closeTag: '<!-- end minjs template tags -->',
                    ignorePath: '../../../public/'
				},
				src: ['public/dist/*min.js'],
				dest: 'application/views/partial/header.php'
			}
		},
		mochaWebdriver: {
			options: {
				timeout: 1000 * 60 * 3
			},
			test : {
				options: {
					usePhantom: true,
					usePromises: true
				},
				src: ['test/**/*.js']
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint']
		},
		cachebreaker: {
			dev: {
				options: {
					match: [ {
						'opensourcepos.min.js': 'public/dist/opensourcepos.min.js',
						'opensourcepos.min.css': 'public/dist/opensourcepos.min.css'
					} ],
					replacement: 'md5'
				},
				files: {
					src: ['application/views/partial/header.php', 'application/views/login.php']
				}
			}
		},
		clean: {
			license: ['public/bower_components/**/bower.json']
		},
		license: {
			all: {
				// Target-specific file lists and/or options go here. 
				options: {
					// Target-specific options go here. 
					directory: 'public/bower_components',
					output: 'public/license/bower.LICENSES'
				}
			}
		},
		'bower-licensechecker': {
			options: {
				/*directory: 'path/to/bower',*/
				acceptable: [ 'MIT', 'BSD', 'LICENSE.md' ],
				printTotal: true,
				warn: {
					nonBower: true,
					noLicense: true,
					allGood: true,
					noGood: true
				},
				log: {
					outFile: 'public/license/.licenses',
					nonBower: true,
					noLicense: true,
					allGood: true,
					noGood: true,
				}
			}
		},
		apigen: {
			generate:{
				options: {
					apigenPath: 'vendor/bin/',
					source: 'application',
					destination: 'docs'
				}
			}
		},
		compress: {
			main: {
				options: {
					mode: 'zip',
					archive: 'dist/opensourcepos.zip'
				},
				files: [
					{
						src: [
							'public/**',
							'vendor/**',
							'application/**',
							'!/application/tests',
							'!/public/images/menubar/png/',
							'!/public/dist/bootswatch/',
							'/public/dist/bootswatch/*/*.css',
							'database/**',
							'*.txt',
							'*.md',
							'LICENSE',
							'docker*',
							'docker/**',
							'Dockerfile',
							'**/.htaccess',
							'*.csv'
						]
					}
				]
			}
		}
	});

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-mocha-webdriver');
	grunt.loadNpmTasks('grunt-composer');
	grunt.loadNpmTasks('grunt-apigen');
    grunt.loadNpmTasks('grunt-contrib-compress');
    
    grunt.registerTask('default', ['wiredep', 'bower_concat', 'bowercopy', 'concat', 'uglify', 'cssmin', 'tags', 'cachebreaker']);
    grunt.registerTask('update', ['composer:update', 'bower:update']);
    grunt.registerTask('genlicense', ['clean:license', 'license', 'bower-licensechecker']);
    grunt.registerTask('package', ['default', 'compress']);
    grunt.registerTask('packages', ['composer:update']);
    grunt.registerTask('gendocs', ['apigen:generate']);

};
