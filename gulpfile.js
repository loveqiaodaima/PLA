var gulp = require("gulp");
gulp.task("copy-html", function(){
	return gulp.src("index.html")
	.pipe(gulp.dest("dist"))
	.pipe(connect.reload());
})
gulp.task("images", function(){
	// return gulp.src("images/*.jpg").pipe(gulp.dest("dist/images"));
	
	//拷贝所有后缀为jpg和png的图片
	// return gulp.src("images/*.{jpg,png}").pipe(gulp.dest("dist/images"));

	//拷贝文件夹内的图片
	// return gulp.src("images/*/*").pipe(gulp.dest("dist/images"));
	
	//如何把所有的图片拷贝过来
	return gulp.src("images/**/*")
	.pipe(gulp.dest("dist/images"))
	.pipe(connect.reload());

})
var scss = require("gulp-sass-china");