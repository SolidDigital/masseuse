/*globals module:true */
module.exports = function(grunt) {
    'use strict';
    grunt.config('watch', {
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
    });
};