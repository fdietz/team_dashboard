app.factory("BooleanModel", ["$http", function($http) {

  function getFieldsParams(config) {
    var input = {
      proxy_url: config.proxy_url,
      proxy_value_path: config.proxy_value_path,
      command: config.command
    };

    return _.map(input, function(value, key) {
      return "fields[" + key + "]=" + encodeURIComponent(value);
    }).join("&");
  }

  function getParams(config) {
    return { source: config.source };
  }

  function getData(config) {
    return $http.get("/api/data_sources/boolean?" + getFieldsParams(config), { params: getParams(config) });
  }

  return {
    getData: getData
  };
}]);