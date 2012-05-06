(function (models) {

  models.Instrument = Backbone.Model.extend({
    urlRoot: '/api/instruments',

    defaults: {
      "name"    : "Undefined name",
      "metrics" : []
    }
  });

})(app.models);