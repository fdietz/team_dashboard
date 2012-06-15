(function ($, _, Backbone, views, router){
  "use strict";

  views.Dashboards = Backbone.View.extend({

    events: {
      "click .dashboard-create": "createDashboard"
    },

    initialize: function(options) {
      _.bindAll(this, "render");
      this.collection.on('reset', this.render);
    },

    render: function() {
      $(this.el).html(JST['templates/dashboards/index']({ dashboards: this.collection.toJSON() }));

      if (!this.collection.isFetched) {
        this.collection.fetch();
        return this;
      }

      return this;
    },

    createDashboard: function() {
      var model = new app.models.Dashboard();
      model.save({}, {
        success: function(model, request) {
          window.app.router.navigate("/dashboards/" + model.id, { trigger: true });
        }
      });
    }

  });

})($, _, Backbone, app.views, app.router);
