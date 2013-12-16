app.directive("graphite", ["FlotrGraphHelper", "GraphiteModel", function(FlotrGraphHelper, GraphiteModel) {

  var currentColors = [];

  var linkFn = function(scope, element, attrs) {

    var WIDTH = 265;
    function onSuccess(data) {
      element.height(WIDTH);

      console.log("graphite-web response", data.content);

      element.html(data.content);

      // remove background
      element.find(".graphite > path").remove();
    }

    function update() {
      return GraphiteModel.getData(scope.widget, calculateWidth(scope.widget.size_x), WIDTH).success(onSuccess);
    }

    function calculateWidth(size_x) {
      var widthMapping = { 1: 290, 2: 630, 3: 965 };
      return widthMapping[size_x];
    }

    scope.init(update);

    // changing the widget config width should redraw graph
    scope.$watch("config.size_x", function(newValue, oldValue) {
      if (newValue !== oldValue) {
        element.width(calculateWidth(scope.widget.size_x));
        scope.init(update);
      }

    });

  };

  return {
    template: '<div class="graph-container">' +
              '</div>',
    link: linkFn
  };
}]);