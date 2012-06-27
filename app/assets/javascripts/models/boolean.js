(function ($, _, Backbone, models) {
  "use strict";

  models.Boolean = Backbone.Model.extend({
    initialize: function(options) {
      this.source = options.source;
    },

    url: function() {
      var params = ['source=' + this.source];
      return "/api/boolean?" + params.join('&');
    }
  });

})($, _, Backbone, app.models);
