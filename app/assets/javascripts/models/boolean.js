(function ($, _, Backbone, models) {
  "use strict";

  models.Boolean = Backbone.Model.extend({
    initialize: function(options) {
      this.source         = options.source;
      this.http_proxy_url = options.http_proxy_url;
      this.value_path     = options.value_path;
    },

    parse: function(response) {
      this.populated = true;
      return response;
    },

    url: function() {
      var params = ['source=' + encodeURIComponent(this.source)];
      if (this.source === "http_proxy" && this.http_proxy_url) {
        params.push("http_proxy_url=" + encodeURIComponent(this.http_proxy_url));
      }
      return "/api/boolean?" + params.join('&');
    },

    resolveValue: function() {
      var path = this.get("value_path");

      if (!this.populated) {
        return 0;
      }

      if (this.source === "http_proxy" && path && path.length > 0) {
        return this.resolvePath(path);
      } else {
        return this.get("value");
      }
    },

    // select single value from json using dot path notation (example.nestedChild.value)
    resolvePath: function(path) {
      var fields = path.split(".");
      var result = this.toJSON();
      for (var i = 0, n = fields.length; i < n; i++) {
        result = result[fields[i]];
      }
      return result;
    }
  });

})($, _, Backbone, app.models);
