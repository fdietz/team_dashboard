app.directive("ci", ["CiModel", function(CiModel) {

  var linkFn = function(scope, element, attrs, WidgetCtrl) {

    function current_status_message(current_status) {
      switch(current_status) {
        case 0:
          return "Sleeping...";
        case 1:
          return "Building...";
        default:
          return "";
      }
    }

    function lastBuildStatusClass(last_build_status) {
      switch(last_build_status) {
        case 0:
          return "green";
        case 1:
          return "red";
        case -1:
          return "gray";
        default:
          return "gray";
      }
    }

    function onSuccess(data) {
      scope.data = data;
      scope.data.label = scope.data.label || scope.widget.label;
      scope.data.current_status_message = current_status_message(scope.data.current_status);
      scope.data.lastBuildStatusClass = lastBuildStatusClass(scope.data.last_build_status);
      scope.data.buildingClass = scope.data.current_status === 1 ? "building" : "";
    }

    function update() {
      return CiModel.getData(scope.widget).success(onSuccess);
    }

    scope.init(update);
  };

  return {
    templateUrl: "templates/widgets/ci/show.html",
    link: linkFn
  };
}]);