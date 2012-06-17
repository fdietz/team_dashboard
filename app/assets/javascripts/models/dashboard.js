(function ($, _, Backbone, models) {
  "use strict";

  models.Dashboard = Backbone.Model.extend({
    urlRoot: '/api/dashboards',

    defaults: {
      "name"        : "Undefined name"
    },

    updateLayout: function(widgetId) {
      if ( _.indexOf(this.get('layout'), widgetId) === -1) {
        this.get('layout').push(widgetId);
      }
    }

  });

})($, _, Backbone, app.models);
