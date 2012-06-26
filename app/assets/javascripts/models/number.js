(function ($, _, Backbone, models) {
  "use strict";

  models.Number = Backbone.Model.extend({
    initialize: function(options) {
      this.source = options.source;
    },

    url: function() {
      var params = ['source=' + this.source];
      return "/api/number?" + params.join('&');
    }
  });

})($, _, Backbone, app.models);
