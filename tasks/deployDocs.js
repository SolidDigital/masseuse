/*globals module:true */
module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('deployDocs', 'Deploy to gh-pages', [
        'clean:build', 'jshint', 'jsdoc', 'shell:commitJsdoc', 'shell:bower', 'copy:jsdoc',
        'copy:app', 'copy:tests', 'buildGhPages:jsdoc', 'shell:bower'
    ]);
};
