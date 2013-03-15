app.controller("MainCtrl", ["$scope", "$rootScope", "$timeout", "$location", function($scope, $rootScope, $timeout, $location) {

  $scope.fullscreen = false;

  BigScreen.onenter = function() {
    $scope.fullscreen = true;
    $scope.$apply(function() { $(".navbar").slideUp("fast"); });
    $scope.showFullscreenNotification();
  };

  BigScreen.onexit = function() {
    $scope.fullscreen = false;
    $scope.$apply(function() { $(".navbar").slideDown("fast"); });
  };

  $scope.toggleFullscreen = function() {
    $scope.fullscreen = !$scope.fullscreen;
    if (BigScreen.enabled) {
      BigScreen.toggle();
    }
  };

  $scope.showFullscreenNotification = function() {
    var el = $('#fullscreen-notification');
    $scope.$apply(function() {
      el.modal('show');
    });
    $timeout(function(){ el.modal('hide'); }, 2000);
  };

}]);
