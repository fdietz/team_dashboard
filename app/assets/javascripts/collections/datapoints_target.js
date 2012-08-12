(function ($, _, Backbone, collections, model) {
  "use strict";

  collections.DatapointsTarget = Backbone.Collection.extend({
    model: model,
    populated: false,

    initialize: function(options) {
      this.source = options.source;
    },

    parse: function(response) {
      this.populated = true;
      return response;
    },

    autocomplete_names: function() {
      return this.map(function(metric) {
        return metric.get('name');
      });
    },

    url: function() {
      var params = ['source=' + encodeURIComponent(this.source)];
      return "/api/datapoints_targets?" + params.join('&');
    }
  });

})($, _, Backbone, app.collections, app.models.DatapointsTarget);
