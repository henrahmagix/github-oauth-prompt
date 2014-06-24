'use strict';

module.exports = function (grunt) {

    // Show elapsed time at the end.
    require('time-grunt')(grunt);

    // Load all grunt tasks with jit-grunt.
    require('jit-grunt')(grunt, {
        // Static mappings.
    });

    // Project configuration.
    grunt.initConfig({
        config: {
            files: {
                lib: ['lib/**/*.js'],
                test: ['test/**/*.js']
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
                src: '<%= config.files.test %>'
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
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'shell:mocha']
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['jshint', 'shell:mocha']);

};
