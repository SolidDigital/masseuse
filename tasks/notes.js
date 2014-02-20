/*globals module:true */
module.exports = function(grunt) {
    'use strict';

    var path = require('path'),
        fileSeparator = require('./config').fileSeparator,
        _ = require('lodash');

    grunt.registerTask('notes:since', function(start, stop) {
        var display = start ? false : true,
            files = [];
        grunt.file.recurse('release_notes', function(file) {
            var version = path.basename(file, '.md'), parts;
            version = version.substring(0,version.indexOf(fileSeparator));
            parts = version.split('.');
            files.push({version:version,parts:parts,file:file});
        });
        files = files.sort(function(fileA, fileB) {
            if (fileA.parts[0] !== fileB.parts[0]) {
                return fileA.parts[0] - fileB.parts[0];
            }
            if (fileA.parts[1] !== fileB.parts[1]) {
                return fileA.parts[1] - fileB.parts[1];
            }
            if (fileA.parts[2] !== fileB.parts[2]) {
                return fileA.parts[2] - fileB.parts[2];
            }
        });
        _.each(files, function(file) {
            if (display) {
                grunt.log.subhead(file.version);
                grunt.log.writeln(grunt.file.read(file.file));
            }
            if (start === file.version) {
                display = true;
            }
            if (stop === file.version) {
                display = false;
            }
        });
    });
};
