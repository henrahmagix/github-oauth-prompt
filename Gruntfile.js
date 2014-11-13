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
                test: ['<%= config.dirs.test %>/**/*.js']
            }
        },

        shell: {
            mocha: {
                command: '$(npm bin)/mocha -b <%= config.files.test %> -u tdd'
            },
            coverage: {
                command: '$(npm bin)/istanbul cover $(npm bin)/_mocha -- -b <%= config.files.test %> --ui tdd'
            }
        },

        coveralls: {
            all: {
                src: 'coverage/lcov.info'
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

        jscs: {
            options: {
                config: '.jscsrc'
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
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile', 'jscs:gruntfile']
            },
            lib: {
                files: '<%= config.files.lib %>',
                tasks: ['jshint:lib', 'jscs:lib', 'mocha']
            },
            test: {
                files: '<%= config.files.test %>',
                tasks: ['jshint:test', 'jscs:test', 'mocha']
            }
        }

    });

    grunt.registerTask('mocha', ['shell:mocha']);
    grunt.registerTask('coverage', ['shell:coverage']);
    grunt.registerTask('test', ['jshint', 'jscs', 'mocha']);

    // Default task.
    grunt.registerTask('default', ['test', 'watch']);

};
