// Karma configuration
// Generated on Sat Oct 19 2013 17:24:25 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'vendor/assets/javascripts/jquery.js',
      'vendor/assets/javascripts/jquery_ujs.js',
      'vendor/assets/javascripts/underscore.js',

      'vendor/assets/javascripts/angular.js',
      'vendor/assets/javascripts/angular-animate.js',
      'vendor/assets/javascripts/angular-resource.js',
      'vendor/assets/javascripts/angular-route.js',
      'vendor/assets/javascripts/angular-sanitize.js',

      'vendor/assets/javascripts/jquery.gridster.js',
      'vendor/assets/javascripts/jquery.knob.js',
      'vendor/assets/javascripts/jquery.timeago.js',
      'vendor/assets/javascripts/jquery.timeago.en-short.js',
      'vendor/assets/javascripts/json2.js',
      'vendor/assets/javascripts/moment.min.js',

      'vendor/assets/javascripts/bigscreen.min.js',
      'vendor/assets/javascripts/bootbox.js',
      'vendor/assets/javascripts/flotr2.js',
      'vendor/assets/javascripts/ui-bootstrap-custom-0.5.0.js',

      'app/assets/javascripts/app.js',

      'app/assets/javascripts/services/**/*.js',
      'app/assets/javascripts/filters/**/*.js',
      'app/assets/javascripts/controllers/**/*.js',
      'app/assets/javascripts/directives/**/*.js',
      'app/assets/javascripts/widgets/**/*.js',

      // html2js puts template in $templateCache
      'app/assets/javascripts/templates/**/*.html',
      'app/assets/javascripts/templates/**/*.html.erb',

      'spec/javascripts/helpers/**/*.js',

      'spec/javascripts/directives/**/*spec.js',
      'spec/javascripts/models/**/*spec.js',
      'spec/javascripts/services/**/*spec.js',
      'spec/javascripts/widgets/**/*spec.js',

    ],


    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    preprocessors: {
      'app/assets/javascripts/templates/**/*.html': 'html2js',
      'app/assets/javascripts/templates/**/*.html.erb': 'html2js'
    },

    ngHtml2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'app/assets/javascripts/',
    }
  });
};
