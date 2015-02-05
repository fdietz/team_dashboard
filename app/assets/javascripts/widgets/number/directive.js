app.directive("number", ["NumberModel", "SuffixFormatter", function(NumberModel, SuffixFormatter) {

  var linkFn = function(scope, element, attrs) {
    // console.log(element.html(), attrs)

    function calculatePercentage(value, previousValue) {
      console.log("previous", previousValue, "value", value);
      if(previousValue == 0) {
        return 0;
      }
      return ((value - previousValue) / previousValue) * 100;
    }

    function onSuccess(data) {
      scope.data = data;
      scope.data.label = scope.data.label || scope.widget.label;
      if(scope.data.value > 10) { scope.data.value = Math.round(scope.data.value); } // We want to see fractions for small numbers
      scope.data.stringValue = scope.widget.use_metric_suffix ? SuffixFormatter.format(scope.data.value, 1) : scope.data.value.toString();

      var previousData = scope.previousData;
      if (previousData) {
        scope.data.secondaryValue = calculatePercentage(scope.data.value, previousData.value);
        scope.data.arrow = scope.data.secondaryValue > 0 ? "arrow-up" : "arrow-down";
        scope.data.color = scope.data.secondaryValue > 0 ? "color-up" : "color-down";
      }
    }

    function update() {
      return NumberModel.getData(scope.widget).success(onSuccess);
    }

    scope.init(update);
  };

  return {
    templateUrl: "templates/widgets/number/show.html",
    link: linkFn
  };
}]);
