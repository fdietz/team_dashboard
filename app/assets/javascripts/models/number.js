(function ($, _, Backbone, models) {
  "use strict";

  models.Number = Backbone.Model.extend({
    initialize: function(options) {
      this.source         = options.source;
      this.http_proxy_url = options.http_proxy_url;
    },

    url: function() {
      var params = ['source=' + encodeURIComponent(this.source)];
      if (this.http_proxy_url) {
        params.push("http_proxy_url=" + encodeURIComponent(this.http_proxy_url));
      }
      return "/api/number?" + params.join('&');
    }
  });

})($, _, Backbone, app.models);
