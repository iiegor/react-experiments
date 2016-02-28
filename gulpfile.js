'use strict';

var babel = require('gulp-babel');
var del = require('del');
var concatCSS = require('gulp-concat-css');
var derequire = require('gulp-derequire');
var flatten = require('gulp-flatten');
var assign = require('object-assign');
var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var runSequence = require('run-sequence');
var through = require('through2');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var webpackDevServer = require('webpack-dev-server');
var loaderUtils = require('loader-utils');

var babelDefaultOpts = require('./scripts/babel/default-options');
var babelCxTransform = require('./scripts/babel/cx-replacement');
var babelPluginDEV = require('fbjs-scripts/babel/dev-expression');
var gulpCheckDependencies = require('fbjs-scripts/gulp/check-dependencies');

var paths = {
  dist: 'dist',
  lib: 'lib',
  src: [
    'src/**/*.js',
    '!src/**/__tests__/**/*.js',
    '!src/**/__mocks__/**/*.js',
  ],
  css: [
    'src/**/*.css',
  ],
};

var selectorMap = {};

var babelOpts = assign({}, babelDefaultOpts, {
  plugins: babelDefaultOpts.plugins.concat([
    babelCxTransform.transformer
  ]),
});

// Ensure that we use another plugin that isn't specified in the default Babel
// options, converting __DEV__.
babelOpts.plugins.push(babelPluginDEV);

var buildDist = function(opts) {
  var webpackOpts = {
    debug: opts.debug,
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    output: {
      filename: opts.output,
    },
    plugins: [
      new webpackStream.webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          opts.debug ? 'development' : 'production'
        ),
      }),
      new webpackStream.webpack.optimize.OccurenceOrderPlugin(),
      new webpackStream.webpack.optimize.DedupePlugin(),
    ],
  };
  if (!opts.debug) {
    webpackOpts.plugins.push(
      new webpackStream.webpack.optimize.UglifyJsPlugin({
        compress: {
          hoist_vars: true,
          screw_ie8: true,
          warnings: false,
        },
      })
    );
  }
  
  return webpackStream(webpackOpts, null, function(err, stats) {
    if (err) {
      throw new gulpUtil.PluginError('webpack', err);
    }
    if (stats.compilation.errors.length) {
      gulpUtil.log('webpack', '\n' + stats.toString({colors: true}));
    }
  });
};

gulp.task('clean', function() {
  return del([paths.dist, paths.lib]);
});

gulp.task('modules', function() {
  // Pass css selectors map to the transform
  babelCxTransform.setSelectorMap(selectorMap);

  return gulp
    .src(paths.src)
    .pipe(babel(babelOpts))
    .pipe(flatten())
    .pipe(gulp.dest(paths.lib));
});

gulp.task('css', function() {
  return gulp
    .src(paths.css)
    .pipe(through.obj(function(file, encoding, callback) {
      var contents = file.contents.toString();
      var replaced = contents.replace(
        // Regex based on MakeHasteCssModuleTransform: ignores comments,
        // strings, and URLs
        /\/\*.*?\*\/|'(?:\\.|[^'])*'|"(?:\\.|[^"])*"|url\([^)]*\)|(\.(?:public\/)?[\w-]*\/{1,2}[\w-]+)/g,
        function(match, cls) {
          if (cls) {
            var selector = cls.replace(/\//g, '-');

            if (process.env.NODE_ENV !== 'development') {
              var selectorHash = '_' + loaderUtils.getHashDigest(selector, '', 'base64', 5);

              selectorMap[cls.replace('.', '')] = selectorHash;

              selector = '.' + selectorHash;
            }

            return selector;
          } else {
            return match;
          }
        }
      );
      replaced = replaced.replace(
        // MakeHasteCssVariablesTransform
        /\bvar\(([\w-]+)\)/g,
        function(match, name) {
          var vars = {
            'fbui-desktop-text-placeholder': '#9197a3',
            'fbui-desktop-text-placeholder-focused': '#bdc1c9',
          };
          if (vars[name]) {
            return vars[name];
          } else {
            throw new Error('Unknown CSS variable ' + name);
          }
        }
      );
      file.contents = new Buffer(replaced);
      callback(null, file);
    }))
    .pipe(concatCSS('App.css'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('dist', ['css', 'modules'], function() {
  var opts = {
    debug: true,
    output: 'App.js',
  };
  return gulp.src('./lib/App.js')
    .pipe(buildDist(opts))
    .pipe(derequire())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('dist:min', ['modules'], function() {
  var opts = {
    debug: false,
    output: 'App.min.js',
  };
  return gulp.src('./lib/App.js')
    .pipe(buildDist(opts))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('check-dependencies', function() {
  return gulp
    .src('package.json')
    .pipe(gulpCheckDependencies());
});

gulp.task('watch', function() {
  gulp.watch(paths.src, ['modules']);
});

/**
 * TODO: Find a better setup
 */
gulp.task('serve', ['watch'],function() {
  gulp.watch(paths.src, ['modules', 'dist']);
  gulp.watch(paths.css, ['dist']);

  var server = new webpackDevServer(webpack({
    debug: true,
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    output: {
      filename: 'App.js',
      path: '/'
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
    ],
  }), {
    contentBase: '.',
    publicPath: '/dist/',
    stats: {colors: true},
  });

  server.listen(8080);
});

gulp.task('default', function(cb) {
  runSequence('clean', 'modules', ['dist', 'dist:min'], cb);
});
