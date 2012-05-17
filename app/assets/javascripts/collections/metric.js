(function (collections, model) {
  collections.Metric = Backbone.Collection.extend({
    model: model,
    url: '/api/metrics'
  });

})( app.collections, app.models.Metric);