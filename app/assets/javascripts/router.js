(function (app) {

  app.Router = Backbone.Router.extend({

    routes: {
      "":                 "metricsIndex",
      "metrics":          "metricsIndex",
      "metrics/:name":    "metricsShow",
      "dashboards":       "dashboardsIndex",
      "dashboards/:id":   "dashboardsShow",
      "instruments":      "instrumentsIndex",
      "instruments/:id":  "instrumentsShow",
      "about":            "aboutShow"
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
      $("div.navbar a[data-navigation-url]").parent().removeClass("active");

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
      };

      $("div.navbar a[data-navigation-url='/"+ selectedMenu +"']").parent().addClass("active");
    },

    handleErrors: function(response) {
      var errorsView = new app.views.Errors({ response: response });
      this.showView(errorsView);
    },

    metricsIndex: function() {
      console.log("ROUTER: metrics");
      
      var that = this;
      app.collections.metrics.fetch({ 
        success: function(model, response) {
          var metricsView = new app.views.Metrics({ collection: app.collections.metrics })
          that.showView(metricsView);  
        }, 
        error: function(model, response) {
          that.handleErrors(response);
        }
      });
    },

    metricsShow: function(name) {
      console.log("ROUTER: metric details:", name);
      
      metric = new app.models.Metric({ name: name});
      var that = this;
      metric.fetch({
        success: function(model, response) {
          var metricView = new app.views.Metric({ model: model });
          that.showView(metricView);
        },
        error: function(model, response) {
          that.handleErrors(response);
        }
      });
    },

    dashboardsIndex: function() {
      console.log("ROUTER: dashboards");
      
      var that = this;
      app.collections.dashboards.fetch({ 
        success: function(model, response) {
          var dashboardsView = new app.views.Dashboards({ collection: app.collections.dashboards });
          that.showView(dashboardsView);  
        }, 
        error: function(model, response) {
          that.handleErrors(response);
        }
      });
      
    },

    dashboardsShow: function(id) {
      console.log("ROUTER: dashboard_detail");

      dashboard = new app.models.Dashboard({ id: id });
      var that = this;
      dashboard.fetch({
        success: function(model, response) {
          var dashboardView = new app.views.Dashboard({ model: model });
          that.showView(dashboardView);  
        },
        error: function(model, response) {
          that.handleErrors(response);
        }
      });
    },

    instrumentsIndex: function() {
      console.log("ROUTER: instruments");
      
      var that = this;
      app.collections.instruments.fetch({ 
        success: function(model, response) {
          var instrumentsView = new app.views.Instruments({ collection: app.collections.instruments });
          that.showView(instrumentsView);  
        }, 
        error: function(model, response) {
          that.handleErrors(response);
        }
      });
    },

    instrumentsShow: function(id) {
      console.log("ROUTER: instrument_detail", id);

      instrument = new app.models.Instrument({ id: id });
      var that = this;
      instrument.fetch({
        success: function(model, response) {
          app.collections.metrics.fetch(); // autocomplete in add metric dialog
          var instrumentView = new app.views.Instrument({ model: model });
          that.showView(instrumentView);
        },
        error: function(model, response) {
          that.handleErrors(response);
        }
      });
    },

    aboutShow: function() {
      console.log("ROUTER: about");
      var aboutView = new app.views.About();
      this.showView(aboutView);
    }
  });

})(app);