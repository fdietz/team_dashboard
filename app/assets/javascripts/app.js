var app = angular.module("TeamDashboard", ["ngResource", "ngSanitize", "ngRoute", "ui.bootstrap"]);

app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when("/dashboards", { templateUrl: 'templates/dashboards/index.html', controller: "DashboardIndexCtrl" })
    .when("/dashboards/:id", { templateUrl: 'templates/dashboards/show.html.erb', controller: "DashboardShowCtrl" })
    .when("/about", { templateUrl: 'templates/abouts/show.html', controller: "AboutCtrl" })
    .otherwise({ redirectTo: "/dashboards" });
}]);


app.config(["$httpProvider", function($httpProvider) {
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');

  $httpProvider.defaults.headers.common['Accept'] = "application/json" ;
  $httpProvider.defaults.headers['common']['X-Requested-With'] = 'XMLHttpRequest';
}]);

app.constant("DASHBOARD_COLUMN_COUNT", 4);

// use angular/mustache style {{variable}} interpolation
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};