module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            my_target: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['src/<%= pkg.name %>.js']
                }
            }
        },
        clean: {
            release: ["dist/", "npm-debug.log"]
        }
    });

    for (var key in grunt.file.readJSON('package.json').devDependencies) {
        if (key !== "grunt" && key.indexOf("grunt") === 0) grunt.loadNpmTasks(key);
    }

    grunt.registerTask('default', ['uglify']);
};

