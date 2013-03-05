app.factory("ExampleModel", ["$http", function($http) {
  return $http.get("/api/number", { params: { source: "demo" } });
}]);
