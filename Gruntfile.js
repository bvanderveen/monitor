module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    lint5: {
      views: "src",
      templates: {
        "index.html": ';',
      }
    },
    sass: {
      dist: {
        files: {
          'dist/css/style.css': 'app/css/style.scss'
        }
      }
    },
    jshint: {
      files: ['app/js/*.js'],
      options: {
        ignores: ['app/js/modernizr.*.*.js', 'app/js/jquery-2.0.3.min.js']
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'app/css/', src: ['*.css'], dest: 'dist/css', filter: 'isFile'},
          {expand: true, cwd: 'app/css/lib', src: ['*.css'], dest: 'dist/css/lib', filter: 'isFile'},
          {expand: true, cwd: 'app/', src: ['*.html'], dest: 'dist', filter: 'isFile'},
          {expand: true, cwd: 'app/', src: ['main.js'], dest: 'dist', filter: 'isFile'},
          {expand: true, cwd: 'app/partials/', src: ['*.html'], dest: 'dist/partials', filter: 'isFile'},
          {expand: true, cwd: 'app/js/', src: ['*.js'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, cwd: 'app/js/app/', src: ['*.js'], dest: 'dist/js/app', filter: 'isFile'},
          {expand: true, cwd: 'app/js/app/ui/', src: ['*.js'], dest: 'dist/js/app/ui', filter: 'isFile'},
          {expand: true, cwd: 'app/images/', src: ['*.*'], dest: 'dist/images/', filter: 'isFile'},
          {expand: true, cwd: 'app/js/lib/', src: ['*.js'], dest: 'dist/js/lib/', filter: 'isFile'},
          {expand: true, cwd: 'test/', src: ['spec.js'], dest: 'dist/js/app', filter: 'isFile'},
          {expand: true, cwd: 'test/', src: ['test-main.js'], dest: 'dist', filter: 'isFile'},
          {expand: true, cwd: 'server/kore', src: ['*'], dest: 'dist/server/kore', filter: 'isFile'},
          {expand: true, cwd: 'server/kore/src', src: ['*'], dest: 'dist/server/kore/src', filter: 'isFile'},
          {expand: true, cwd: 'server/kore/conf', src: ['*'], dest: 'dist/server/kore/conf', filter: 'isFile'},
          {expand: true, cwd: 'server/kore/assets', src: ['*'], dest: 'dist/server/kore/assets', filter: 'isFile'},
          {expand: true, cwd: 'server/kore/cert', src: ['*'], dest: 'dist/server/kore/cert', filter: 'isFile'}

        ]
      }
    },
    clean: ['dist/'],
    connect: {
      server: {
        options: {
          base: "dist"
        }
      }
    },
    watch: {
      src: {
        files: [
        'Gruntfile.js', 
        'schema.scm',
        'app/**/*.html',
        'app/main.js',
        'app/css/**/*.scss', 
        'app/css/**/*.css', 
        'app/js/**/*.js',
        'test/**/*.js',
        'server/**/*.c',
        'server/**/*.h'],
        tasks: ['default']
      },
      options: {
        atBegin: true
      }
    },
    wait: {
      briefly: {
        options: {
          delay: 1000
        }
      },
      brieflyer: {
        options: {
          delay: 3000
        }
      }
    },
    shell: {
      cauterize: {
        command: 
        "mkdir -p dist/js/lib; " +
        "cauterize --schema schema.scm --output dist/schema.spec; " +
        "caut-javascript-ref-gen --spec dist/schema.spec  --output dist/js/lib; " +
        "caut-c11-ref --spec dist/schema.spec  --output dist/server/kore/src; "
      },
      wrap_cauterize_output: {
        command:
        "node node_modules/requirejs/bin/r.js -convert dist/schema/ dist/js/lib; " +
        "node node_modules/requirejs/bin/r.js -convert dist/schema/libcaut dist/js/lib/libcaut; " +
        "node node_modules/requirejs/bin/r.js -convert dist/schema/libcaut/prototypes dist/js/lib/libcaut/prototypes; "
      },
      test: {
        command:
        "cd dist; node test-main.js"
      },
      kore_build: {
        command:
        "cd dist/server/kore; " +
        "kore clean;" +
        "CPATH=/opt/kore/include kore build"
      },
      kore_run: {
        command:
        "cd dist/server/kore; " +
        "kore run "
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-lint5');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-shell')
  grunt.loadNpmTasks('grunt-wait');

  grunt.registerTask('default', ['test']);
  grunt.registerTask('test', [
    'jshint', 
    'clean', 
    'copy', 
    'shell:cauterize', 
    'shell:kore_build',
    'shell:test',
    'shell:kore_run']);
  grunt.registerTask('develop', ['connect', 'wait:briefly', 'watch']);
  grunt.registerTask('deploy', ['jshint', 'clean', 'preprocess:prod', 'sass', 'copy']);
  

};

