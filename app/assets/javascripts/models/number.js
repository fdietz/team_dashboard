(function ($, _, Backbone, models) {
  "use strict";

  models.Number = Backbone.Model.extend({
    initialize: function(options) {
      this.source = options.source;
      this.fields = options.fields;
    },

    parse: function(response) {
      this.populated = true;
      return response;
    },

    url: function() {
      var params = ['source=' + encodeURIComponent(this.source)];
      params = params.concat(this.fieldsParams());

      return "/api/number?" + params.join('&');
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
