app.controller("MainCtrl", ["$scope", "$rootScope", "Fullscreen", function($scope, $rootScope, Fullscreen) {

  $rootScope.fullscreen = false;

  $scope.toggleFullscreen = function() {
    if (!BigScreen.enabled) return;

    $rootScope.fullscreen = !$rootScope.fullscreen;
    BigScreen.toggle();
  };

}]);
