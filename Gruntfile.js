module.exports = function(grunt) {

  grunt.initConfig({
    src: "src/",

    uglify: {
      build: {
        src: [
          '<%= src %>javascripts/*.js'
        ],
        dest: 'assets/javascripts/issuecon.min.js'
      }
    },

    watch: {
      js: {
        files: ['<%= src %>javascripts/*.js'],
        tasks: ['js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask('js', ['uglify']);

  grunt.registerTask('default', ['js']);
};