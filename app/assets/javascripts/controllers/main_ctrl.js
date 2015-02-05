app.controller("MainCtrl", ["$scope", "$rootScope", "$location", "Fullscreen", function($scope, $rootScope, $location, Fullscreen) {

    $rootScope.minimalui = $location.search().minimalui || false;

    BigScreen.onenter = function() {
        $rootScope.minimalui = true;
        $rootScope.$apply();
    }

    BigScreen.onexit = function() {
        $rootScope.minimalui = $location.search().minimalui || false;
        $rootScope.$apply();
    }

    $scope.toggleFullscreen = function() {
      if (!BigScreen.enabled) return;
      BigScreen.toggle();
    };

}]);
