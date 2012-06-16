(function($, _, Backbone){
  "use strict";

  window.app = {};
  window.app.collections = {};
  window.app.models = {};
  window.app.views = {};
  window.app.views.widgets = {};
  window.app.mixins = {};

  $(function(){
    window.app.collections.metrics     = new window.app.collections.Metric({});
    window.app.collections.dashboards  = new window.app.collections.Dashboard({});

    window.app.router = new window.app.Router();
    Backbone.history.start({ pushState: true });
  });

})($, _, Backbone);
