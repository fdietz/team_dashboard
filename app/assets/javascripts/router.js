(function (app) {

  app.Router = Backbone.Router.extend({
    routes: {
      "":                "home",
      "metrics":         "metrics",
      "metrics/:name":   "metric_details",
      "dashboards":      "dashboards",
      "dashboards/:id":  "dashboard_details",
      "instruments":      "instruments",
      "instruments/new":  "instruments_new",
      "instruments/:id":  "instrument_details",
      "about":          "about"
    },

    home: function() {
      console.log("ROUTER: home");
      new app.views.App({ el: "#main", collection: app.collections.metrics }).render();
    },

    metrics: function() {
      console.log("ROUTER: metrics");
      app.collections.metrics.fetch();
      new app.views.App({ el: "#main", collection: app.collections.metrics }).render();
    },

    metric_details: function(name) {
      console.log("ROUTER: metric details:", name);

      metric = new app.models.Metric({ name: name});
      metric.fetch({
        success: function(model, resp) {
          new app.views.Metric({ el: "#main", model: model }).render();
        },
        error: function() {
          alert("Document not found:"+id);
        }
      });
    },

    dashboards: function() {
      console.log("ROUTER: dashboards");
      app.collections.dashboards.fetch();
      new app.views.Dashboards({ el: "#main", collection: app.collections.dashboards }).render();
    },

    dashboard_details: function(id) {
      console.log("ROUTER: dashboard_detail");
      dashboard = new app.models.Dashboard({ id: id });
      dashboard.fetch({
        success: function(model, resp) {
          console.log(model);
          //app.collections.instruments.fetch();
          new app.views.Dashboard({ el: "#main", model: model }).render();
        },
        error: function() {
          alert("Document not found:"+id);
        }
      });
    },

    instruments: function() {
      console.log("ROUTER: instruments");
      app.collections.instruments.fetch();
      new app.views.Instruments({ el: "#main", collection: app.collections.instruments }).render();
    },

    instrument_details: function(id) {
      console.log("ROUTER: instrument_detail");

      instrument = new app.models.Instrument({ id: id });
      instrument.fetch({
        success: function(model, resp) {
          console.log(model);
          app.collections.metrics.fetch(); // autocomplete in add metric dialog
          new app.views.Instrument({ el: "#main", model: model }).render();
        },
        error: function() {
          alert("Document not found:"+id);
        }
      });
    },

    instruments_new: function() {
      console.log("ROUTER: instruments_new");
      new app.views.Instrument({ el: "#main", model: new app.models.Instrument() }).render();
    },

    about: function() {
      console.log("ROUTER: about");
    }
  });

})(app);