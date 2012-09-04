(function ($, _, Backbone, models) {
  "use strict";

  models.Boolean = Backbone.Model.extend({
    initialize: function(options) {
      this.source = options.source;
      this.fields = options.fields;
      this.include_response_body = options.include_response_body || false;
    },

    parse: function(response) {
      this.populated = true;
      return response;
    },

    url: function() {
      var params = ['source=' + encodeURIComponent(this.source), 'include_response_body=' + encodeURIComponent(this.include_response_body)];
      params = params.concat(this.fieldsParams());

      return "/api/boolean?" + params.join('&');
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
