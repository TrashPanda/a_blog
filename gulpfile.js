/*
  currently includes
  -sass,
  -browserify
*/


//taskrunner for frontend mainly
var gulp        = require('gulp');
var sass        = require('gulp-sass');             //sass to produce css
var browserify  = require('browserify');            //bundle client side js
var source      = require('vinyl-source-stream');   //for browserify

//env settings
var env = process.env.NODE_ENV || 'development';    //'development' mode if not stated

//'sass' action to complie css file
gulp.task('sass', function(){
  return gulp.src('./src/sass/main.scss')
    .pipe(sass({sourceComments: 'map'}))
    .pipe(gulp.dest('./public/stylesheets'));
});


//'browserify' to compile clientside js
gulp.task('js',function(){
    return browserify('src/js/backboneApp.js', { debug:env === 'development' })
    //return browserify('src/js/main.js', { debug:env === 'development' })
    .bundle()
    .pipe(source('main.js'))          //vinyl translate the ouput of browserify
    .pipe(gulp.dest('./public/javascripts'));
});




//watcher for src files change, and call action respectively
gulp.task('watch',function(){
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js']);
});


//default to auto watch
gulp.task('default', ['sass', 'js', 'watch']);
