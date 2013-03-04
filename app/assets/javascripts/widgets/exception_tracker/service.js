app.factory("ExceptionTrackerModel", function($http) {

  function getParams(config) {
    return { source: config.source, fields: config.fields };
  }

  function getData(config) {
    return $http.get("/api/exception_tracker", { params: getParams(config) });
  }

  return {
    getData: getData
  };
});
