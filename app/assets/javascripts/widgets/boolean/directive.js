app.directive("boolean", ["BooleanModel", function(BooleanModel) {

  var linkFn = function(scope, element, attrs) {

    function onSuccess(data) {
      scope.data = data;
      scope.data.label = scope.data.label || scope.widget.label;
    }

    function update() {
      return BooleanModel.getData(scope.widget).success(onSuccess);
    }

    scope.init(update);
  };

  return {
    templateUrl: "templates/widgets/boolean/show.html",
    link: linkFn
  };
}]);