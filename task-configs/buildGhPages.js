/*globals module:true */
module.exports = function(grunt) {
    'use strict';
    grunt.config('buildGhPages', {
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