app.directive("meter", ["NumberModel", function(NumberModel) {

  var linkFn = function(scope, element, attrs) {
    var knob = element.find("input");

    knob.knob();

    function onSuccess(data) {
      scope.data       = data;
      scope.data.label = scope.data.label || scope.widget.label;
      scope.data.min   = scope.data.min || scope.widget.min || 0;
      scope.data.max   = scope.data.max || scope.widget.max || 100;
    }

    function update() {
      return NumberModel.getData(scope.widget).success(onSuccess);
    }

    scope.init(update);

    scope.$watch("data.value", function(newValue, oldValue) {
      knob.val(newValue).trigger("change");
    });

    scope.$watch("data.min", function(newValue, oldValue) {
      knob.trigger("configure", { min: newValue });
    });

    scope.$watch("data.max", function(newValue, oldValue) {
      knob.trigger("configure", { max: newValue });
    });

  };

  return {
    template: $("#templates-widgets-meter-show").html(),
    link: linkFn
  };
}]);