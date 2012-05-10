(function(){

  window.app = {};
  app.collections = {};
  app.models = {};
  app.views = {};
  app.mixins = {};
  
  $(function(){

    app.router = new app.Router();

    app.collections.metrics = new app.collections.Metric();
    app.collections.dashboards = new app.collections.Dashboard();
    app.collections.instruments = new app.collections.Instrument();

    Backbone.history.start({pushState: true});
  });

})();