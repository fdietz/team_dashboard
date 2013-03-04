// usage example:
//  <input type="text" blur="doSomething()" ng-model="myModel"/>
app.directive('blur', function () {
  return function (scope, elem, attrs) {
    elem.bind('blur', function () {
      scope.$apply(attrs.blur);
    });
  };
});