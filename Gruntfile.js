'use strict';

module.exports = function (grunt) {

    // Show elapsed time at the end.
    require('time-grunt')(grunt);

    if (grunt.option('help')) {
        // Load all tasks so they get output in the help.
        require('load-grunt-tasks')(grunt);
    } else {
        // Load only the task that is being called by using jit-grunt.
        require('jit-grunt')(grunt, {
            // Static mappings go here.
        });
    }

    // Project configuration.
    grunt.initConfig({
        config: {
            dirs: {
                lib: 'lib',
                test: 'test'
            },
            files: {
                lib: ['<%= config.dirs.lib %>/**/*.js'],
                test: ['<%= config.dirs.test %>/github-oauth_test.js'],
                testLint: ['<%= config.dirs.test %>/**/*.js']
            }
        },
        shell: {
            mocha: {
                command: 'npm test',
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: '<%= config.files.lib %>'
            },
            test: {
                src: '<%= config.files.testLint %>'
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:lib', 'shell:mocha']
            },
            test: {
                files: '<%= config.files.test %>',
                tasks: ['jshint:test', 'shell:mocha']
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['jshint', 'shell:mocha']);

};
