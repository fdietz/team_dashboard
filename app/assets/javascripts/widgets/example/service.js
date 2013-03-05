app.factory("ExampleModel", ["$http", function($http) {
  return $http.get("/api/data_sources/number", { params: { source: "demo" } });
}]);
