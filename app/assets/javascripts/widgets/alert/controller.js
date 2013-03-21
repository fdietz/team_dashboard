app.controller("AlertCtrl", ["$scope", function($scope) {

    var defaults = {
        size_x: 2,
        size_y: 1,
        update_interval: 10
    };

    if (!$scope.widget.id) {
        _.extend($scope.widget, defaults);
    }

}]);