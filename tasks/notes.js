/*globals module:true */
module.exports = function(grunt) {
    'use strict';

    var path = require('path'),
        fileSeparator = require('./config').fileSeparator;

    grunt.registerTask('notes:since', function(start, stop) {
        var display = start ? false : true;
        grunt.file.recurse('release_notes', function(file) {
            var version = path.basename(file, '.md');
            version = version.substring(0,version.indexOf(fileSeparator));
            if (display) {
                grunt.log.subhead(version);
                grunt.log.writeln(grunt.file.read(file));
            }
            if (start === version) {
                display = true;
            }
            if (stop === version) {
                display = false;
            }
        });
    });
};
