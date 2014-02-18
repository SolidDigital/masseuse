/*globals module:true */
module.exports = function(grunt) {
    'use strict';
    grunt.config('open', {
        reload : {
            path : 'http://localhost:9001/'
        },
        masseuse : {
            path : 'http://localhost:9001/tests/'
        }
    });
};