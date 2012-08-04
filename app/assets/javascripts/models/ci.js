(function ($, _, Backbone, models) {
  "use strict";

  models.Ci = Backbone.Model.extend({
    initialize: function(options) {
      this.source     = options.source;
      this.server_url = options.server_url;
      this.project    = options.project;
    },

    url: function() {
      var params = ['source=' + this.source, 'server_url=' + this.server_url, 'project=' + this.project];
      return "/api/ci?" + params.join('&');
    }
  });

})($, _, Backbone, app.models);
