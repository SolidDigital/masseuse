/*globals module:true */
module.exports = function(grunt) {
    'use strict';

    var fileSeparator = require('./config').fileSeparator,
        path = require('path'),
        _ = require('lodash');
            // grunt.util._ is depracated

    grunt.registerTask('releaseNotes', 'read in files to make release notes', function() {
        var types = ['backward incompatibilities', 'features', 'patches'],
            previous = ['0','0','0'],
            notes = '',
            last = '',
            files = [];

        grunt.file.recurse('release_notes', function(file) {
            var name = path.basename(file, '.md'),
                separatorAt = name.indexOf(fileSeparator),
                version = name.substring(0,separatorAt),
                date = name.substring(separatorAt + 1),
                current = version.split('.');

            files.push({name: name, version: version, date: date, current: current});
        });
        files = files.sort(function(fileA, fileB) {
            if (fileA.current[0] !== fileB.current[0]) {
                return fileA.current[0] - fileB.current[0];
            }
            if (fileA.current[1] !== fileB.current[1]) {
                return fileA.current[1] - fileB.current[1];
            }
            if (fileA.current[2] !== fileB.current[2]) {
                return fileA.current[2] - fileB.current[2];
            }
        });
        _.each(files, function(file) {
            var name = file.name,
                version = file.version,
                date = file.date,
                current = file.current,
                updateType = '';

            last = version;
            _.each(current, function(value, index) {
                if (previous[index].trim() != current[index].trim()) {
                    updateType = types[index];
                    return false;
                }
                return undefined;
            });
            previous = current;

            notes += '* ' + version + ' - ' + date + ' - [' + updateType +
                '](https://github.com/Solid-Interactive/masseuse/blob/master/release_notes/' + name + '.md)\n';
        });
        if (grunt.config.get('pkg').version !== last) {
            grunt.fatal('Latest release notes and package.version do not match');
        }
        grunt.log.writeln(notes);
        grunt.config.set('releaseNotes', notes);
    });
};
