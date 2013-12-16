app.controller("MainCtrl", ["$scope", "$rootScope", "$timeout", "$location", "Fullscreen", function($scope, $rootScope, $timeout, $location, Fullscreen) {

  $rootScope.fullscreen = false;

  $scope.toggleFullscreen = function() {
    if (!BigScreen.enabled) return;

    $rootScope.fullscreen = !$rootScope.fullscreen;
    BigScreen.toggle();
  };

}]);
