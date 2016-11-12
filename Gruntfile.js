/* global module */

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
            'string-replace': {
            dist: {
            files: {
            'dist/': 'public/<%= pkg.name %>.js'
            },
                    options: {
                    replacements: [{
                    pattern: '###VERSION###',
                            replacement: '<%= pkg.version %>'
                    }]
                    }
            }
            },
            jshint: {
            all: ['lib/**/*.js']
            },
            yuidoc: {
            all: {
            name: '<%= pkg.name %>',
                    description: '<%= pkg.description %>',
                    version: '<%= pkg.version %>',
                    url: '<%= pkg.homepage %>',
                    options: {
                    nocode: true,
                            paths: ['lib/'],
                            outdir: 'doc/'
                    }
            }
            },
            mochaTest: {
            test: {
            options: {
            reporter: 'spec',
                    captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
            },
                    src: ['test/**/*.js']
            }
            },
            env: {
            coverage: {
            APP_DIR_FOR_CODE_COVERAGE: '../coverage/instrument/lib/'
            }
            },
            instrument: {
            files: 'lib/*.js',
                    options: {
                    lazy: true,
                            basePath: 'coverage/instrument/'
                    }
            },
            storeCoverage: {
            options: {
            dir: 'coverage/reports'
            }
            },
            makeReport: {
            src: 'coverage/reports/**/*.json',
                    options: {
                    type: 'cobertura',
                            dir: 'coverage/reports',
                            print: 'detail'
                    }
            }
    });

    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-env');

    grunt.registerTask('test2', ['mochaTest']);
    grunt.registerTask('check', ['jshint']);
    grunt.registerTask('test', ['qunit']);
    grunt.registerTask('coverage', ['string-replace', 'jshint', 'env:coverage', 'instrument', 'mochaTest', 'storeCoverage', 'makeReport']);
    grunt.registerTask('jenkins', ['string-replace', 'jshint', 'env:coverage', 'instrument', 'mochaTest', 'storeCoverage', 'makeReport']);
    grunt.registerTask('default', ['string-replace', 'jshint', 'mochaTest', 'yuidoc']);
};
