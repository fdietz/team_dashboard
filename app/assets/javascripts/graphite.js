(function(_, helpers) {

  helpers.Graphite = function() {
  };

  helpers.Graphite.listFunctions = function() {
    return helpers.GRAPHITE_FUNCTIONS;
  };

  helpers.Graphite.getFunction = function(name) {
    return _.find(this.listFunctions(), function(f) {
      return f.name === name;
    });
  };

})(_, app.helpers);
