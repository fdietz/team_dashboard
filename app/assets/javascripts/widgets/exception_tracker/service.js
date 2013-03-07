app.factory("ExceptionTrackerModel", ["$http", function($http) {

  function getFieldsParams(config) {
    var input = {
      server_url: config.server_url,
      api_key:    config.api_key
    };

    return _.map(input, function(value, key) {
      return "fields[" + key + "]=" + encodeURIComponent(value);
    }).join("&");
  }

  function getParams(config) {
    return { source: config.source };
  }

  function getData(config) {
    return $http.get("/api/data_sources/exception_tracker?" + getFieldsParams(config), { params: getParams(config) });
  }

  return {
    getData: getData
  };
}]);
