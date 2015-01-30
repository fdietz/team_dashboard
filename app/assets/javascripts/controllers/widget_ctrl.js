app.controller("WidgetCtrl", ["$scope", "$timeout", "$rootScope", function($scope, $timeout, $rootScope) {

  var previousData = null;
  var timer = null;
  var abortTimer = false;
  var updateFunction = null;

  $rootScope.$on('$routeChangeStart', function(ngEvent, route) {
    abortTimer = true;
    if (timer) $timeout.cancel(timer);
  });

  function onError(response) {
    $scope.showError = true;
    if (response.status === 0) {
      $scope.widget.message = "Could not connect to rails app";
    } else {
      $scope.widget.message = response.data.message;
    }
  }

  function onSuccess(response) {
    $scope.showError = false;

    if (response && response.data) $scope.previousData = response.data;
  }

  function updateTimer() {
    $scope.widget.enableSpinner = false;

    if (!abortTimer) timer = $timeout(startTimer, $scope.widget.update_interval * 1000);
  }

  function startTimer() {
    $scope.widget.enableSpinner = true;

    var result = updateFunction();
    if (result && result.then) {
      result.then(onSuccess, onError).then(updateTimer);
    } else {
      onSuccess(result);
      updateTimer();
    }
  }

  $scope.init = function(updateFn) {
    updateFunction = updateFn;
    startTimer();
  };

}]);
