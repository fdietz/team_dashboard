(function (collections, model) {

    collections.Instrument = Backbone.Collection.extend({
    model: model,
    url: '/api/instruments'
  });

})(app.collections, app.models.Instrument);