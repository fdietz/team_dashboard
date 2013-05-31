// usage example:
//  <input type="text" td:autocomplete="searchUrl()" ng-model="myModel"/>
app.directive("tdAutocomplete", ["$http", function ($http) {
  return {
    require: "ngModel",
    replace: true,
    link: function(scope, element, attrs, ngModel) {

      function query(searchTerm, processCallback) {
        var url = scope.$eval(attrs.tdAutocomplete).replace("%QUERY", searchTerm);
        $http.get(url).success(function(result) {
          processCallback(result);
        });
      }

      element.typeahead({
        source: query,
        minLength: 3
      });

      function read() {
        ngModel.$setViewValue(element.val());
      }

      element.bind("blur change", function() {
        scope.$apply(read);
      });
    }
  };
}]);