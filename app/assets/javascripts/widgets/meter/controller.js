app.controller("MeterCtrl", ["$scope", "Sources", "EditorFormOptions", function($scope, Sources, EditorFormOptions) {

  var defaults = {
    size_x: 1, size_y: 2,
    update_interval: 10,
    min: 0,
    max: 100,
    range: "30-minutes",
    aggregate_function: "average"
  };

  if (!$scope.widget.id) {
    _.extend($scope.widget, defaults);
  }

  $scope.datapointsSources = Sources.availableSources("datapoints");
  $scope.aggregate_functions  = EditorFormOptions.aggregate_functions;

  $scope.aggregateFunction = [
    { value: "average",    label: "Average" },
    { value: "sum",        label: "Sum" },
    { value: "difference", label: "Difference" }
  ];

  $scope.supportsTargetBrowsing = function() {
    return Sources.supportsTargetBrowsing($scope.widget);
  };

  $scope.editTargets = function() {
    var templateUrl    = "/assets/templates/targets/index.html";

    dialog.targets = $scope.widget.targets;
    dialog.source = $scope.widget.datapoints_source;
    dialog.open(templateUrl, "TargetsCtrl").then(convertTargetsArrayToString);
  };

  function convertTargetsArrayToString(result) {
    $scope.widget.targets = _.map(dialog.$scope.targets, function(t) {
      return t.content;
    }).join(";");
  }
}]);