'use strict'

//reused partly from https://github.com/mgonto/restangular/blob/master/Gruntfile.js (best Gruntfile organization I saw until now)
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: [
        '/**',
        ' * <%= pkg.description %>',
        ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
        ' * @link <%= pkg.homepage %>',
        ' * @author <%= pkg.author %>',
        ' * @license MIT License, http://www.opensource.org/licenses/MIT',
        ' */'
      ].join('\n')
    } ,
    dirs: {
      dest: 'dist'
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['src/*.js'],
        dest: '<%= dirs.dest %>/<%= pkg.name %>.js'
      }
    },
    cssmin: {
      minify: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.css', '!*.min.css'],
          dest: '<%= dirs.dest %>/',
          ext: '.min.css'
        }]
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: ['<%= concat.dist.dest %>'],
        dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/*.js'],
      options: {
        jshintrc: true
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        regExp: false
      }
    },
    clean: {
      dist:  ['<%= dirs.dest %>']

    }
  });

  grunt.registerTask('default', ['build']);
  // Build task.
  grunt.registerTask('build', ['concat', 'uglify', 'cssmin']);
};
