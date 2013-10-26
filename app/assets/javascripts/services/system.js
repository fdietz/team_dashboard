app.factory("System", ["$http", function($http) {

  var System = {
  };

  System.load = function() {
    // used in karma tests only (see spec/javascripts/helpers/SpecHelper.js)
    if (typeof SystemMock != 'undefined') {
      _.extend(System, SystemMock);
      return;
    }

    return $http.get("/api/system").success(function(result) {
      _.extend(System, result);
    });
  };

  return System;
}]);