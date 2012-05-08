(function (app) {

  app.Router = Backbone.Router.extend({

    routes: {
      "":                 "metricsIndex",
      "metrics":          "metricsIndex",
      "metrics/:name":    "metricsShow",
      "dashboards":       "dashboardsIndex",
      "dashboards/new":   "dashboardsNew",
      "dashboards/:id":   "dashboardsShow",
      "instruments":      "instrumentsIndex",
      "instruments/new":  "instrumentsNew",
      "instruments/:id":  "instrumentsShow",
      "about":            "aboutShow"
    },

    initialize: function(options) {
      // _.bindAll(this, "showView");
    },

    showView: function(view) {
      if (this.currentView) {
        this.currentView.close();
      }

      this.currentView = view;
      this.currentView.render();

      $("#main").html(this.currentView.el);
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

    dashboardsNew: function() {
      console.log("ROUTER: dashboards new");

      var dashboardView = new app.views.Dashboard({ model: new app.models.Dashboard() });
      this.showView(dashboardView);
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

    instrumentsNew: function() {
      console.log("ROUTER: instruments_new");

      var instrumentView = new app.views.Instrument({ model: new app.models.Instrument() });
      this.showView(instrumentView);
    },

    aboutShow: function() {
      console.log("ROUTER: about");
      var aboutView = new app.views.About();
      this.showView(aboutView);
    }
  });

})(app);