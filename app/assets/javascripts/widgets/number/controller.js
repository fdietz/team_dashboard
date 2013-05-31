app.controller("NumberCtrl", ["$scope", "Sources", "EditorFormOptions", "$dialog", function($scope, Sources, EditorFormOptions, $dialog) {

  var dialog = $dialog.dialog();

  var defaults = {
    size_x: 1, size_y: 1,
    update_interval: 10,
    use_metric_suffix: true,
    range: "30-minutes",
    graph_type: "area",
    aggregate_function: "average"
  };

  if (!$scope.widget.id) {
    _.extend($scope.widget, defaults);
  }

  $scope.datapointsSources = Sources.availableSources("datapoints");

  $scope.graphTypes           = EditorFormOptions.graphTypes;
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