app.controller("TargetsCtrl", ["$scope", "dialog", function($scope, dialog) {

  function prefillTargets() {
    if (_.isEmpty(dialog.targets)) return [];

    return _.map(dialog.targets.split(";"), function(t) {
      return { content: t, editing: false };
    });
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
    var index = _.indexOf($scope.targets, target);
    $scope.targets.splice(index, 1);

    if ($scope.selectedTarget === target) {
      $scope.selectedTarget = (index > $scope.targets.length-1) ? $scope.targets[$scope.targets.length-1] : $scope.targets[index];
    }
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