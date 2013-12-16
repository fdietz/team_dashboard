app.directive('blankOnEscape', function() {

  var ESCAPE_KEY = 27;

  return function(scope, element, attrs) {

    function clear() {
      scope[attrs.blankOnEscape] = "";
    }

    element.bind("keyup", function(event) {
      if (event.keyCode === ESCAPE_KEY) {
        scope.$apply(clear);
        event.preventDefault();
      }
    });
  };
});