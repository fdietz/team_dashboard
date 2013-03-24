app.directive("graph", ["FlotrGraphHelper", "GraphModel", function(FlotrGraphHelper, GraphModel) {

  var currentColors = [];

  var linkFn = function(scope, element, attrs) {

    function onSuccess(data) {
      element.height(265);
      Flotr.draw(element[0], FlotrGraphHelper.transformSeriesOfDatapoints(data, scope.widget, currentColors), FlotrGraphHelper.defaultOptions(scope.widget));
    }

    function update() {
      return GraphModel.getData(scope.widget).success(onSuccess);
    }

    function calculateWidth(size_x) {
      var widthMapping = { 1: 290, 2: 630, 3: 965 };
      return widthMapping[size_x];
    }

    scope.init(update);

    // changing the widget config width should redraw flotr2 graph
    scope.$watch("config.size_x", function(newValue, oldValue) {
      if (newValue !== oldValue) {
        element.width(calculateWidth(scope.widget.size_x));
        scope.init(update);
      }

    });

  };

  return {
    template: '<div class="graph-container"></div>',
    link: linkFn
  };
}]);