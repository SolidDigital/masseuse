/*globals module:true */
module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('test', 'Build and watch task', [
        'jshint', 'connect:tests',  'open:masseuse', 'watch'
    ]);
};