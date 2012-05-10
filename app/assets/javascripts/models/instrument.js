(function (models) {

  models.Instrument = Backbone.Model.extend({
    urlRoot: '/api/instruments',

    defaults: {
      "name"    : "Undefined name",
      "metrics" : [],
      "renderer": "line"
    }
  });

})(app.models);