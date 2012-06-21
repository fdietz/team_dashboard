(function ($, _, Backbone, app) {
  "use strict";

  app.Router = Backbone.Router.extend({

    routes: {
      "":                       "metricsIndex",
      "metrics":                "metricsIndex",
      "metrics/:source":        "metricsIndex",
      "metrics/:source/:name":  "metricsShow",
      "dashboards":             "dashboardsIndex",
      "dashboards/:id":         "dashboardsShow",
      "instruments":            "instrumentsIndex",
      "instruments/:id":        "instrumentsShow",
      "about":                  "aboutShow"
    },

    initialize: function(options) {
    },

    showView: function(view) {
      if (this.currentView) {
        this.currentView.close();
      }

      this.currentView = view;
      this.currentView.render();
      $("#main").html(this.currentView.el);

      this.updateNavigationSelection(Backbone.history.fragment);
    },

    updateNavigationSelection: function(fragment) {
      $("div.navbar a[href]").parent().removeClass("active");

      var url = fragment;
      if ( fragment.indexOf("/") > 0) {
        url = url.slice(0, url.indexOf("/"));
      }

      var selectedMenu = null;
      switch(url) {
        case "metric":
        case "metrics":
          selectedMenu = "metrics";
          break;
        case "instruments":
        case "instrument":
          selectedMenu = "instruments";
          break;
        case "dashboards":
        case "dashboard":
          selectedMenu = "dashboards";
          break;
        case "about":
          selectedMenu = "about";
          break;
      }

      $("div.navbar a[href='/"+ selectedMenu +"']").parent().addClass("active");
    },

    metricsIndex: function(source) {
      app.collections.metrics.source = source || $.Sources.first();
      var metricsView = new app.views.Metrics({ collection: app.collections.metrics });
      this.showView(metricsView);
    },

    metricsShow: function(source, name) {
      var view = new app.views.Metric({ model: new app.models.Metric({ name: name }), source: source || $.Sources.first() });
      this.showView(view);
    },

    dashboardsIndex: function() {
      var dashboardsView = new app.views.Dashboards({ collection: app.collections.dashboards });
      this.showView(dashboardsView);
    },

    dashboardsShow: function(id) {
      var that = this;
      var model = new app.models.Dashboard({ id: id });
      var collection = new app.collections.Widget({ dashboard_id:model.id });

      $.when(model.fetch(), collection.fetch()).done(function() {
        var dashboardView = new app.views.Dashboard({ model: model, collection: collection });
        that.showView(dashboardView);
      });
    },

    aboutShow: function() {
      var aboutView = new app.views.About();
      this.showView(aboutView);
    }
  });

})($, _, Backbone, app);
