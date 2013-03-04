app.directive("widget", function($compile) {

  // all widgets depend on this controller function
  var controllerFn = function($scope, $element, $attrs) {
    var previousData = null;

    function initFn(updateFn) {
      var timerId  = null;

      function onError(response) {
        $scope.showError = true;
        if (response.status === 0) {
          $scope.widget.message = "Could not connect to rails app";
        } else {
          $scope.widget.message = response.data.message;
        }
      }

      function onSuccess(response) {
        $scope.showError = false;

        if (response && response.data) memorizeData(response.data);
      }

      function updateTimer() {
        $scope.widget.enableSpinner = false;

        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(startTimer, $scope.widget.update_interval * 1000);
      }

      function startTimer() {
        $scope.widget.enableSpinner = true;

        var result = updateFn();
        if (result && result.then) {
          result.then(onSuccess, onError).then(updateTimer);
        } else {
          onSuccess(result);
          updateTimer();
        }
      }

      startTimer();
    }

    function memorizeData(data) {
      previousData = data;
    }

    function getMemorizedData() {
      return previousData;
    }

    return {
      init: initFn,
      getMemorizedData: getMemorizedData
    };
  };

  var linkFn = function(scope, element, attrs, gridsterController) {
    gridsterController.add(element, scope.widget);

    // TODO: check why we need to add this element dynamically
    var elm = element.find(".widget-content");
    elm.append('<div ' + scope.widget.kind + ' />');
    $compile(elm)(scope);

    element.bind("$destroy", function() {
      gridsterController.remove(element);
    });

    scope.$watch("widget.size_x", function(newValue, oldValue) {
      gridsterController.resize(element, newValue, scope.widget.size_y);
    }, true);
  };

  return {
    require: "^gridster",
    controller: controllerFn,
    link: linkFn
  };
});