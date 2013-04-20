app.controller("TargetsCtrl", ["$scope", "$timeout", "dialog", "$dialog", function($scope, $timeout, dialog, $dialog) {

  function prefillTargets() {
    if (dialog.targets) {
      return _.map(dialog.targets.split(";"), function(t) {
        return { content: t, editing: false };
      });
    }

    return [];
  }

  $scope.targets = prefillTargets();
  if ($scope.targets.length > 0) $scope.selectedTarget = $scope.targets[0];

  $scope.newTarget = "";

  $scope.addTarget = function() {
    $scope.targets.push({ content: $scope.newTarget, editing: false });
    $scope.selectedTarget = $scope.targets[$scope.targets.length-1];
    $scope.newTarget = "";
  };

  $scope.removeTarget = function(target) {
    _.each($scope.targets, function(t, index) {
      if (t === target) {
        $scope.targets.splice(index, 1);
        if ($scope.selectedTarget === t) {
          $scope.selectedTarget = (index > $scope.targets.length-1) ? $scope.targets[$scope.targets.length-1] : $scope.targets[index];
        }
        return;
      }
    });

  };

  $scope.selectedClass = function(target) {
    return (target === $scope.selectedTarget) ? "selected" : "";
  };

  function encodedParams(source) {
    var result = [];
    result.push("source="+encodeURIComponent(source));
    result.push("pattern=%QUERY");
    return result.join("&");
  }

  $scope.searchUrl = function() {
    return "/api/datapoints_targets?"+encodedParams(dialog.source);
  };

  $scope.selectTarget = function(target) {
    $scope.selectedTarget = target;
  };

  $scope.cancel = function() {
    dialog.close();
  };

  $scope.save = function() {
    dialog.close();
  };
}]);