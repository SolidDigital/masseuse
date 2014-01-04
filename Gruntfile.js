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
                    'app/*.js'
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
            ghPages : {
            },
            bower : {
                options : {
                    build_branch : 'bower',
                    dist : 'bower'
                }
            }
        },

        jshint : {
            files : [
                'app/**/*.js',
                'tests/**/*.js',
                '!app/vendor/**/*.js'
            ],
            options : {
                jshintrc : '.jshintrc'
            }
        },

        jsdoc : {
            dist : {
                src: ['README.md','app/**/*.js', '!app/vendor/**'],
                options: {
                    destination: 'docs'
                }
            }
        }
    });

    // To start editing your slideshow using livereload, run 'grunt server'
    grunt.registerTask('test', 'Build and watch task', [
        'jshint', 'connect:tests',  'open:masseuse', 'watch'
    ]);
    grunt.registerTask('deploy', 'Deploy to gh-pages', [
        'jshint', 'copy', 'build_gh_pages'
    ]);

};
