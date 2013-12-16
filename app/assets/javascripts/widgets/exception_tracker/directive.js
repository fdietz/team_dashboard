app.directive("exceptionTracker", ["ExceptionTrackerModel", function(ExceptionTrackerModel) {

  var linkFn = function(scope, element, attrs) {

    function onSuccess(data) {
      scope.data = data;
      scope.data.label = scope.data.label || scope.widget.label;

      scope.data.color = scope.data.unresolved_errors === 0 ? "color-up" : "color-down";
    }

    function update() {
      return ExceptionTrackerModel.getData(scope.widget).success(onSuccess);
    }

    scope.init(update);
  };

  return {
    templateUrl: "templates/widgets/exception_tracker/show.html",
    link: linkFn
  };
}]);