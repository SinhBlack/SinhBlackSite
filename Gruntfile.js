module.exports = function(grunt){

    grunt.initConfig({
        concat: {
            dist: {
                src: ['client/**/*.js'],
                dest: 'client/build/main.js'
            }
        },
        watch: {
            scripts: {
                files: ['client/**/*.js'],
                tasks: ['concat'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

};