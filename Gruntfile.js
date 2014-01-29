/*globals module:true */
module.exports = function (grunt) {
    'use strict';

    var path = require('path');
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({});

    grunt.loadTasks('task-configs');

    // To start editing your slideshow using livereload, run 'grunt server'
    grunt.registerTask('test', 'Build and watch task', [
        'jshint', 'connect:tests',  'open:masseuse', 'watch'
    ]);
    grunt.registerTask('test-cli', 'Run tests headless', [
        'jshint', 'shell:bower', 'shell:testPhantom'
    ]);
    grunt.registerTask('deployDocs', 'Deploy to gh-pages', [
        'readme', 'clean:build', 'jshint', 'jsdoc', 'shell:commitJsdoc', 'shell:bower', 'copy:jsdoc',
        'copy:app', 'copy:tests', 'build_gh_pages:jsdoc', 'shell:bower'
    ]);
    grunt.registerTask('deployBower', 'Deploy to bower', [
        'readme', 'clean:build', 'copy:bower', 'build_gh_pages:bower', 'shell:bower'
    ]);
    grunt.registerTask('deploy', 'deploy docs and bower', ['deployDocs', 'deployBower']);

    grunt.registerTask('notes:since', function(start, stop) {
        var display = start ? false : true;
        grunt.file.recurse('release_notes', function(file) {
            var version = path.basename(file, '.md');
            if (start === version) {
                display = true;
            }
            if (display) {
                grunt.log.subhead(version);
                grunt.log.writeln(grunt.file.read(file));
            }
            if (stop === version) {
                display = false;
            }
        });
    });

    grunt.registerTask('jsdoc', ['clean:jsdoc', 'shell:jsdoc']);

    grunt.registerTask('readme:template', function() {
        grunt.file.write('README.md',
            grunt.template.process(
                grunt.file.read('templates/README.template.md')));
    });
    grunt.registerTask('readme', 'create README.md from template', function() {
        if (grunt.config.get('shortlogDone')) {
            return;
        }

        grunt.config.set('pkg', grunt.file.readJSON('package.json'));
        grunt.config.set('warning', 'Compiled file. Do not modify directly.');
        grunt.task.run(['shell:shortlog', 'readme:template', 'shell:commitReadme']);

        grunt.config.set('shortlogDone', true);
    });
};
