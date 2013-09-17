/*global module:false, require:false*/
module.exports = function (grunt) {

    "use strict";

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
                    'tests/**/*.js'
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
                        return [lrSnippet, folderMount(connect, options.base)]
                    }
                }
            },
            tests : {
                options : {
                    port : 9001,
                    hostname : 'localhost',
                    base : './',
                    middleware : function (connect, options) {
                        return [lrSnippet, folderMount(connect, options.base)]
                    }
                }
            }
        },

        open : {
            reload : {
                path : 'http://localhost:9001/'
            },
            tests : {
                path : 'http://localhost:9001/tests/'
            }
        },

        build_gh_pages : {
            ghPages : {
                options : {
                    build_branch : "builds",
                    dist : "build"
                }
            }
        }
    });

    // To start editing your slideshow using livereload, run "grunt server"
    grunt.registerTask("testServer", "Build and watch task", [ "connect:tests",  "open:tests", "watch"]);
    grunt.registerTask("deploy", "Deploy to gh-pages", ["copy", "build_gh_pages"]);

};