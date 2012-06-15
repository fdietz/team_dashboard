(function ($, _, Backbone, collections, model) {
  "use strict";

  collections.Metric = Backbone.Collection.extend({
    model: model,
    url: '/api/metrics',

    initialize: function() {
      this.isFetched = false;
      this.bind('reset', this.onReset, this);
    },

    onReset: function() {
      this.isFetched = true;
    },

    autocomplete_names: function() {
      return this.map(function(metric) {
        return metric.get('name');
      });
    }
  });

})( $, _, Backbone, app.collections, app.models.Metric);
