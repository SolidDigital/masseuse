/*globals module:true */
module.exports = function (grunt) {
    'use strict';
    grunt.config('clean', {
        build : ['build'],
        jsdoc : ['jsdoc']
    });
};