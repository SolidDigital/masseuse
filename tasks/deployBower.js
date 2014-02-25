/*globals module:true */
module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('deployBower', 'Deploy to bower', [
        'clean:build', 'copy:bower', 'buildGhPages:bower', 'shell:bower'
    ]);
};