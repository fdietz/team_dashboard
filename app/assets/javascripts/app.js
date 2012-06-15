(function($, _, Backbone){
  "use strict";

  window.app = {};
  app.collections = {};
  app.models = {};
  app.views = {};
  app.views.widgets = {};
  app.mixins = {};

  $(function(){
    app.collections.metrics     = new app.collections.Metric();
    app.collections.dashboards  = new app.collections.Dashboard();

    app.router = new app.Router();
    Backbone.history.start({ pushState: true });
  });

})($, _, Backbone);
