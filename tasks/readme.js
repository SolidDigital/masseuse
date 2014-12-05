/*globals module:true */
module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('readme', 'create README.md from template', function() {
        if (grunt.config.get('shortlogDone')) {
            return;
        }

        grunt.config.set('pkg', grunt.file.readJSON('package.json'));
        grunt.config.set('warning', 'Compiled file. Do not modify directly.');
        grunt.task.run(['shell:shortlog', 'releaseNotes', 'shell:commitReadme']);

        grunt.config.set('shortlogDone', true);
    });
};
