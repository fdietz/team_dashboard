(function($, _, Backbone){
  "use strict";

  window.app = {};
  var app = window.app;

  app.collections = {};
  app.models = {};
  app.views = {};
  app.views.widgets = {};
  app.views.WidgetEditor = {};
  app.views.schemas = {};
  app.mixins = {};
  app.helpers = {};


  app.init = function() {
    app.collections.metrics     = new app.collections.Metric({});
    app.collections.dashboards  = new app.collections.Dashboard({});

    app.router = new window.app.Router();
    Backbone.history.start({ pushState: true });
  };

})($, _, Backbone);
