/*globals module:true */
module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('test-cli', 'Run tests headless', [
        'jshint', 'shell:bower', 'shell:testPhantom'
    ]);
};