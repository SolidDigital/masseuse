/*globals module:true */
module.exports = function (grunt) {
    'use strict';
    grunt.config('copy', {
        bower : {
            files : [
                {
                    expand : true,
                    src : [
                        'app/**',
                        '!app/vendor/**',
                        'tests/**',
                        'task-configs/**',
                        'tasks/**',
                        'release_notes/**',
                        'LICENSE-MIT',
                        'setup.sh',
                        'README.md',
                        'bower.json',
                        '.travis.yml',
                        'package.json',
                        'Gruntfile.js',
                        '.jshintrc',
                        '.bowerrc'
                    ],
                    dest : 'build/'
                }
            ]
        },
        jsdoc : {
            files : [
                {
                    expand : true,
                    cwd : 'docs/',
                    src : [
                        '**'
                    ],
                    dest : 'build/docs/'
                }
            ]
        },
        tests : {
            files : [
                {
                    expand : true,
                    cwd : 'tests/',
                    src : [
                        '**'
                    ],
                    dest : 'build/tests/'
                }
            ]
        },
        app : {
            files : [
                {
                    expand : true,
                    cwd : 'app/',
                    src : [
                        '**'
                    ],
                    dest : 'build/app/'
                }
            ]
        }
    });
};