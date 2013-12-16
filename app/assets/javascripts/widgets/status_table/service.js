app.factory("StatusTableModel", ["$http", function($http) {

  function getParams(config) {
    return { source: config.source, widget_id: config.id };
  }

  function getData(config) {
    return $http.get("/api/data_sources/status_table", { params: getParams(config) });
  }

  return {
    getData: getData
  };
}]);
