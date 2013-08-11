app.factory("NumberModel", ["$http", "TimeSelector", function($http, TimeSelector) {

  function getParams(config) {
    var result = {
      source: config.source,
      widget_id: config.id
    };

    if (config.range) {
      _.extend(result, { from: TimeSelector.getFrom(config.range), to: TimeSelector.getCurrent(config.range)})
    }

    return result;
  }

  function getData(config) {
    return $http.get("/api/data_sources/number", { params: getParams(config) });
  }

  return {
    getData: getData
  };
}]);