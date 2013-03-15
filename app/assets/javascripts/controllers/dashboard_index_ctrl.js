app.controller("DashboardIndexCtrl", ["$scope", "$rootScope", "$location", "Dashboard", function($scope, $rootScope, $location, Dashboard) {

  $rootScope.resolved = false;

  $scope.dashboards = Dashboard.query(function() {
    $rootScope.resolved = true;
  });

  $scope.createDashboard = function() {
    var dashboard = new Dashboard({ name: "Undefined name" });
    dashboard.$create(function(data) {
      $location.url("/dashboards/" + data.id);
    });
  };

}]);