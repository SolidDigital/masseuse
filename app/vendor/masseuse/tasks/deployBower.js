/*globals module:true */
module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('deployBower', 'Deploy to bower', [
        'clean:build', 'copy:bower', 'build_gh_pages:bower', 'shell:bower'
    ]);
};