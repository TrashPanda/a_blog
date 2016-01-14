/*
  currently includes
  -sass,
  -browserify
*/


//taskrunner for frontend mainly
var gulp        = require('gulp');
var sass        = require('gulp-sass');             //sass to produce css
var browserify  = require('browserify');            //bundle client side js
var source      = require('vinyl-source-stream');   //necessary for browserify
var stringify   = require('stringify');             //enabling file requiring in client side best solution so far, all we need to do is to require template, then let handlebar module to compile or precompile, all other choices r bad



//env settings
var env = process.env.NODE_ENV || 'development';    //'development' mode if not stated

//'sass' action to complie css file
gulp.task('sass', function(){
  /*
  return gulp.src('./src/sass/main.scss')
    .pipe(sass({sourceComments: 'map'}))
    .pipe(gulp.dest('./public/stylesheets'));
  */

  return gulp.src('./src/sass/custom-bootstrap.scss')
    .pipe(sass({sourceComments: 'map'}))
    .pipe(gulp.dest('./public/stylesheets'));

});


//'browserify' to compile clientside js
gulp.task('js',function(){
    //configuration for the handlebar compiler
    /*
    hbsfy.configure({
      extensions: ['hbs']                         //tell hbsfy that the handlebar template file extension is .hbs
    });
    */

    return browserify('src/js/backbone/app.js', { debug:env === 'development' })
    //this is for testing
    //return browserify('src/js/main.js', { debug:env === 'development' })
    .transform(stringify(['.hbs']))               //enabling  require('<filename>') functionalityin client side, best way yet
    .bundle()
    .pipe(source('bundle.js'))                    //vinyl translate the ouput of browserify
    .pipe(gulp.dest('./public/javascripts'));
});




//watcher for src files change, and call action respectively
gulp.task('watch',function(){
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/js/**/*.hbs', ['js']);
});


//default is called whenever gulp is started, type 'gulp' in terminal
gulp.task('default', ['sass', 'js', 'watch']);










//After note
//var hbsfy       = require('hbsfy');                 //compiles the handlebar templates to be used directly. Note: hbsfy IN FACT has development depencencies on module handlebars. So you still have to explicitly install handlebars --save-dev. I don't think this is a good practice. this sux
