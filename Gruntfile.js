module.exports = function (grunt) {

    'use strict';

    var path = require('path'),
        lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
        folderMount = function folderMount (connect, point) {
            return connect.static(path.resolve(point));
        };

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({

        watch : {
            tests : {
                options : {
                    // Start a live reload server on the default port: 35729
                    livereload : true
                },
                files : [
                    'tests/**/*.js',
                    'app/**/*.js',
                    '!app/vendor/**'
                ],
                tasks : [
                    'jshint'
                ]
            }
        },

        connect : {
            site : {
                options : {
                    port : 9001,
                    hostname : 'localhost',
                    base : './build/',
                    middleware : function (connect, options) {
                        return [lrSnippet, folderMount(connect, options.base)];
                    }
                }
            },
            tests : {
                options : {
                    port : 9001,
                    hostname : 'localhost',
                    base : './',
                    middleware : function (connect, options) {
                        return [lrSnippet, folderMount(connect, options.base)];
                    }
                }
            }
        },

        open : {
            reload : {
                path : 'http://localhost:9001/'
            },
            masseuse : {
                path : 'http://localhost:9001/tests/'
            }
        },

        build_gh_pages : {
            jsdoc : {
                options : {
                    dist : 'build'
                }
            },
            bower : {
                options : {
                    build_branch : 'bower',
                    dist : 'build'
                }
            }
        },

        jshint : {
            files : [
                'app/**/*.js',
                'tests/**/*.js',
                '!app/vendor/**/*.js',
                '!app/vendor2/**/*.js'
            ],
            options : {
                jshintrc : '.jshintrc'
            }
        },

        jsdoc : {
            dist : {
                src: ['README.md', 'app/**/*.js', '!app/vendor/**'],
                options: {
                    'destination' : 'docs',
                    'jsdoc' : 'jsdoc.json'
                }
            }
        },

        clean : {
            build : ['build']
        },

        copy : {
            bower : {
                files : [
                    {
                        expand : true,
                        src: [
                            'app/**',
                            '!app/vendor/**',
                            'tests/**',
                            'release_notes/**',
                            'LICENSE-MIT',
                            'README.md',
                            'bower.json',
                            '.travis.yml',
                            'package.json',
                            'Gruntfile.js',
                            '.jshintrc',
                            '.bowerrc'
                        ],
                        dest : 'build/'
                    }
                ]
            },
            jsdoc : {
                files : [
                    {
                        expand : true,
                        cwd : 'docs/',
                        src: [
                            '**'
                        ],
                        dest : 'build/docs/'
                    }
                ]
            },
            tests : {
                files : [
                    {
                        expand : true,
                        cwd : 'tests/',
                        src: [
                            '**'
                        ],
                        dest : 'build/tests/'
                    }
                ]
            },
            app : {
                files : [
                    {
                        expand : true,
                        cwd : 'app/',
                        src: [
                            '**'
                        ],
                        dest : 'build/app/'
                    }
                ]
            }
        },

        shell : {
            'testPhantom' : {
                options : {
                    stdout : true,
                    stderr : true,
                    failOnError : true
                },
                command : 'mocha-phantomjs tests/index.html'
            },
            'bower'  : {
                options : {
                    stdout : true,
                    stderr : true,
                    failOnError : true
                },
                command : 'bower install'
            },
            'commitJsdoc' : {
                options : {
                    stdout : true,
                    stderr : true,
                    failOnError : true
                },
                command : 'git commit docs -m "jsdoc update"'
            }
        }
    });

    // To start editing your slideshow using livereload, run 'grunt server'
    grunt.registerTask('test', 'Build and watch task', [
        'jshint', 'connect:tests',  'open:masseuse', 'watch'
    ]);
    grunt.registerTask('test-cli', 'Run tests headless', [
        'jshint', 'shell:bower', 'shell:testPhantom'
    ]);
    grunt.registerTask('deployDocs', 'Deploy to gh-pages', [
        'clean:build', 'jshint', 'jsdoc', 'shell:commitJsdoc', 'shell:bower', 'copy:jsdoc',
        'copy:app', 'copy:tests', 'build_gh_pages:jsdoc', 'shell:bower'
    ]);
    grunt.registerTask('deployBower', 'Deploy to bower', [
        'clean:build', 'copy:bower', 'build_gh_pages:bower', 'shell:bower'
    ]);
    grunt.registerTask('deploy', 'deploy docs and bower', ['deployDocs', 'deployBower']);
};
