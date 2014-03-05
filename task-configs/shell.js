/*globals module:true*/
module.exports = function(grunt) {
    'use strict';
    // TODO: add windows support
    var lineEnding = '\n',
        _ = grunt.util._;

    grunt.config('shell', {
        'testPhantom' : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : 'mocha-phantomjs tests/index.html'
        },
        'bower'  : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : 'bower install'
        },
        'commitJsdoc' : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : 'git add docs && git commit docs -nm "jsdoc update"'
        },
        'commitReadme' : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : 'git add README.md && git commit README.md -nm "README update"'
        },
        'shortlog' : {
            options : {
                stderr : true,
                stdout : false,
                failOnError : true,
                callback : function(err, stdout, stderr, cb) {
                    stdout = stdout.split(lineEnding);
                    _.each(stdout, function(line, index) {
                        stdout[index] = line.replace(/^\s*\d+\s+([^\s])/,'* $1');
                    });
                    grunt.config.set('contributors', stdout.join(lineEnding));
                    cb();
                }
            },
            command : 'git --no-pager shortlog -ns HEAD'
        },
        'jsdoc'  : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : 'node_modules/.bin/jsdoc -c jsdoc.json'
        },
        'pushMaster'  : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true
            },
            command : 'git push origin master'
        }
    });
};
