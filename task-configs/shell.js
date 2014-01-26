/*globals module:true*/
module.exports = function(grunt) {
    'use strict';
    grunt.config('shell', {
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
            command : 'git add docs && git commit docs -m "jsdoc update"'
        }
    });
};
