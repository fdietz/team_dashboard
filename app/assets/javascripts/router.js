(function ($, _, Backbone, app) {
  "use strict";

  app.Router = Backbone.Router.extend({

    routes: {
      "":                       "dashboardsIndex",
      "dashboards":             "dashboardsIndex",
      "dashboards/:id":         "dashboardsShow",
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
        case "dashboards":
          selectedMenu = "dashboards";
          break;
        case "about":
          selectedMenu = "about";
          break;
      }

      $("div.navbar a[href='/"+ selectedMenu +"']").parent().addClass("active");
    },

    dashboardsIndex: function() {
      var that = this;
      app.collections.dashboards.fetch().done(function() {
        var dashboardsView = new app.views.Dashboards({ collection: app.collections.dashboards });
        that.showView(dashboardsView);
      });
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
