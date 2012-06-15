(function ($, _, Backbone, collections, model) {
  "use strict";

    collections.Widget = Backbone.Collection.extend({
      model: model,

      initialize: function(options) {
        this.dashboard_id = options.dashboard_id;
      },

      url: function() {
        return "/api/dashboards/" + this.dashboard_id + "/widgets";
      }

  });

})($, _, Backbone, app.collections, app.models.Widget);
