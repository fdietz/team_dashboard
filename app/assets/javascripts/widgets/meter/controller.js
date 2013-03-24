app.controller("MeterCtrl", ["$scope", function($scope) {

  var defaults = {
    size_x: 1, size_y: 2,
    update_interval: 10,
    min: 0,
    max: 100
  };

  if (!$scope.widget.id) {
    _.extend($scope.widget, defaults);
  }

}]);