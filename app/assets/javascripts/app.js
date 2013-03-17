var app = angular.module("TeamDashboard", ["ngResource", "ngSanitize", "ui.bootstrap.modal", "ui.bootstrap.dialog", "ui.bootstrap.transition"]);

app.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when("/dashboards", { template: $('#templates-dashboards-index').html(), controller: "DashboardIndexCtrl" })
    .when("/dashboards/:id", { template: $('#templates-dashboards-show').html(), controller: "DashboardShowCtrl" })
    .when("/about", { template: $('#templates-abouts-show').html(), controller: "AboutCtrl" })
    .otherwise({ redirectTo: "/dashboards" });
});


app.config(function($httpProvider) {
  $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
});

// use angular/mustache style {{variable}} interpolation
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};