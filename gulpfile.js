//taskrunner for frontend mainly
var gulp    = require('gulp');
var sass    = require('gulp-sass');


//'sass' action to complie css file
gulp.task('sass', function(){
  return gulp.src('./src/sass/main.scss')
    .pipe(sass({sourceComments: 'map'}))
    .pipe(gulp.dest('./public/stylesheets'))
});

//watcher for src files change, and call action respectively
gulp.task('watch',function(){
  gulp.watch('src/sass/**/*.scss', ['sass']);
});


//default to auto watch
gulp.task('default', ['sass','watch']);
