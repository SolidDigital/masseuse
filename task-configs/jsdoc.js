/*globals module:true */
module.exports = function(grunt) {
    'use strict';
    grunt.config('jsdoc', {
        dist : {
            src: ['README.md', 'app/**/*.js', '!app/vendor/**'],
            options: {
                'destination' : 'docs',
                'jsdoc' : 'jsdoc.json',
                'template' : 'node_modules/ink-docstrap/template'
            }
        }
    });
};