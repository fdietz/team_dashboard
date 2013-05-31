app.directive('tdBindHtmlUnsafe', function($compile) {
  return {
    scope: {
      tdBindHtmlUnsafe: '='
    },
    replace: true,
    link: function(scope, element, attrs) {
      scope.$watch('tdBindHtmlUnsafe', function(value) {
        element.html(value);
        $compile(element.contents())(scope.$parent);
      });
    }
  };
});