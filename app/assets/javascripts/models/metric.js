(function ( models ) {

  models.Metric = Backbone.Model.extend({
    urlRoot: '/api/metrics'
  });

})( app.models );