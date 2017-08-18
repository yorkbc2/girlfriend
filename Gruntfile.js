module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		uglify: {
			build: {
				src: "gf.js",
				dest: "dist/gf.min.js"
			}
		},
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			target: {
				files: {
					"dist/gf.min.css": ["gf.css"]
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-cssmin");

	grunt.registerTask("default", ["uglify", "cssmin"]);

}