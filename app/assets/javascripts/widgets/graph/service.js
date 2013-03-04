app.factory("GraphModel", function($http, TimeSelector) {

  function getParams(config) {
    return {
      from: TimeSelector.getFrom(config.range),
      to: TimeSelector.getCurrent(config.range),
      source: config.source
    };
  }

  function getTargetArrayParams(targets) {
    var targetArray = (targets || "").split(";");
    return _.map(targetArray, function(target) {
      return "targets[]=" + encodeURIComponent(target);
    }).join('&');
  }

  function getData(config) {
    var url = "/api/datapoints?" + getTargetArrayParams(config.targets);
    return $http.get(url, { params: getParams(config) });
  }

  return {
    getData: getData
  };
});
