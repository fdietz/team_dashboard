app.factory("ExampleModel", function($http) {
  return $http.get("/api/number", { params: { source: "demo" } });
});
