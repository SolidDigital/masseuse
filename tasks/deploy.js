/*globals module:true */
module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('deploy', 'deploy docs and bower', ['deployDocs', 'deployBower', 'shell:pushMaster']);
};
