module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            videoplayer:{
                src:['src/js/map_popupbox.js',
                'src/js/windowInOutEvent.js'
                ],
                dest:'build/map_popupbox.js'
            }
        },
        uglify: {
            videoplayer:{
                src:['build/map_popupbox.js'],
                dest:'build/map_popupbox.min.js',
                banner:''
            }
        },
        cssmin: {
            build: {
                src  : ['src/css/map_popupbox.css'],
                dest : 'build/css/map_popupbox.min.css'
            }
        },
        copy: {
            build: {
                expand  : true,
                cwd     : 'src/',
                src     : ['*/*.*','!js/*.*','!scss/*.*','!css/*.*'],
                dest    : 'build/',
               // flatten : true,
               filter  : 'isFile'
            }
        },
        watch:{
            css:{
                files:['src/css/map_popupbox.css'],
                tasks:['cssmin']
            },
            js:{
                files:['src/js/*.*'],
                tasks:['concat', 'uglify', 'copy']
            }
        }
    });


    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy']);
    grunt.registerTask('watchfile', ['watch']);




};