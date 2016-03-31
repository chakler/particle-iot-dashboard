module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    sass: {
      build: {
        files: {
          'css/main.css': 'css/dev/main.scss'
        }
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({browsers: 'last 3 versions'}),
          require('css-mqpacker'),
          require('cssnano')({autoprefixer: false})
        ]
      },
      main: {
        src: 'css/main.css'
      }
    },

    uglify: {
      options: {
        preserveComments: 'some',
        mangle: {
          except: [
            'js/dev/plugins.js'
          ]
        }
      },
      build: {
        files: {
          'js/main.min.js': ['js/dev/plugins.js', 'js/dev/main.js']
        }
      }
    },

    watch: {
      sasscss: {
        files: ['css/dev/*.scss'],
        tasks: ['sass:build', 'postcss', 'notify:sass'],
        options: {
          spawn: false
        }
      },
      scripts: {
        files: ['js/dev/main.js','js/dev/plugins.js'],
        tasks: ['uglify:build', 'notify:js'],
        options: {
          spawn: false
        }
      }
    },

    notify: {
      sass: {
        options: {
          title: 'Stylesheets are ready!',
          message: 'Your sass files are successfully compiled.'
        }
      },
      js: {
        options: {
          title: 'Scripts are now very ugly!',
          message: 'Your js files are successfully uglified.'
        }
      }
    }

  }); 

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-notify');

  grunt.registerTask('default', 'watch');
  grunt.registerTask('css', ['sass:build', 'postcss', 'notify:sass']);
  grunt.registerTask('js', ['uglify', 'notify:js']);

};