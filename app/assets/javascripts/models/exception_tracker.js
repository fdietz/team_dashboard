(function ($, _, Backbone, models) {
  "use strict";

  models.ExceptionTracker = Backbone.Model.extend({
    initialize: function(options) {
      this.source = options.source;
      this.fields = options.fields;
    },

    url: function() {
      var params = ['source=' + encodeURIComponent(this.source)];
      params = params.concat(this.fieldsParams());

      return "/api/exception_tracker?" + params.join('&');
    },

    fieldsParams: function() {
      var params = [];

      _.each(this.fields, function(value, key, list) {
        params.push("fields[" + key + "]=" + encodeURIComponent(value));
      });

      return params;
    }
  });

})($, _, Backbone, app.models);
