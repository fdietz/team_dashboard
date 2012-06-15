(function ($, _, Backbone, collections, model) {
  "use strict";

  collections.Dashboard = Backbone.Collection.extend({
    model: model,
    url: '/api/dashboards',

    initialize: function() {
      this.isFetched = false;
      this.bind('reset', this.onReset, this);
    },

    onReset: function() {
      this.isFetched = true;
    }
  });

})($, _, Backbone, app.collections, app.models.Dashboard);
