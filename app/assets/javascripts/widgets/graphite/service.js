app.factory("GraphiteModel", ["$http", "TimeSelector", function($http, TimeSelector) {

  function getParams(config, width, height) {
    return {
      from: TimeSelector.getFrom(config.range),
      to: TimeSelector.getCurrent(config.range),
      source: config.source,
      widget_id: config.id,
      width: width,
      height: height
    };
  }

  function getData(config, width, height) {
    return $http.get("/api/data_sources/graphite", { params: getParams(config, width, height) });
  }

  return {
    getData: getData
  };
}]);