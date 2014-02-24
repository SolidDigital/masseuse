/*globals module:true */
module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('jsdoc', ['clean:jsdoc', 'readme', 'shell:jsdoc']);
};