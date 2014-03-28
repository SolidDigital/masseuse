/*globals module:true */
module.exports = function(grunt) {
    'use strict';
    var path = require('path'),
        lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
        folderMount = function folderMount (connect, paths) {
            return connect.static(path.resolve(paths[0]));
        };
    grunt.config('connect', {
        site : {
            options : {
                port : 9999,
                hostname : 'localhost',
                base : './build/',
                middleware : function (connect, options) {
                    return [lrSnippet, folderMount(connect, options.base)];
                }
            }
        },
        tests : {
            options : {
                port : 9999,
                hostname : 'localhost',
                base : './',
                middleware : function (connect, options) {
                    return [lrSnippet, folderMount(connect, options.base)];
                }
            }
        }
    });
};
