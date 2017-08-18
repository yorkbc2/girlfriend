module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		uglify: {
			build: {
				src: "gf.js",
				dest: "dist/gf.min.js"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");

	grunt.registerTask("default", ["uglify"]);

}