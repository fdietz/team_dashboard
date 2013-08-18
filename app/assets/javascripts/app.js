var app = angular.module("TeamDashboard", ["ngResource", "ngSanitize", "ui.bootstrap"]);

app.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when("/dashboards", { template: JST['templates/dashboards/index'], controller: "DashboardIndexCtrl" })
    .when("/dashboards/:id", { template: JST['templates/dashboards/show'], controller: "DashboardShowCtrl" })
    .when("/about", { template: JST['templates/abouts/show'], controller: "AboutCtrl" })
    .otherwise({ redirectTo: "/dashboards" });
});


app.config(function($httpProvider) {
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
});

app.constant("DASHBOARD_COLUMN_COUNT", 4);

// use angular/mustache style {{variable}} interpolation
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};