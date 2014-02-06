/*globals module:true */
module.exports = function (grunt) {
    'use strict';

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json')
    });

    grunt.loadTasks('task-configs');
    grunt.loadTasks('tasks');
};
