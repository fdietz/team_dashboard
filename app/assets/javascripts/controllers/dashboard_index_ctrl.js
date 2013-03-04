app.controller("DashboardIndexCtrl", function($scope, $location, Dashboard) {
  $scope.dashboards = Dashboard.query();

  $scope.createDashboard = function() {
    var dashboard = new Dashboard({ name: "Undefined name" });
    dashboard.$create(function(data) {
      $location.url("/dashboards/" + data.id);
    });
  };

});