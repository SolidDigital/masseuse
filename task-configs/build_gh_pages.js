/*globals module:true */
module.exports = function(grunt) {
    'use strict';
    grunt.config('build_gh_pages', {
        jsdoc : {
            options : {
                dist : 'build'
            }
        },
        bower : {
            options : {
                build_branch : 'bower',
                dist : 'build'
            }
        }
    });
};