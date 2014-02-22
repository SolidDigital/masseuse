/*globals module:true */
module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('jsdoc', ['clean:jsdoc', 'shell:shortlog', 'releaseNotes', 'readme', 'shell:jsdoc']);
};