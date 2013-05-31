app.factory("BooleanModel", ["$http", function($http) {

  function getParams(config) {
    return { source: config.source, widget_id: config.id };
  }

  function getData(config) {
    return $http.get("/api/data_sources/boolean", { params: getParams(config) });
  }

  return {
    getData: getData
  };
}]);