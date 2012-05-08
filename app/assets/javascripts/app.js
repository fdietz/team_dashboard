(function(){

  window.app = {};
  app.collections = {};
  app.models = {};
  app.views = {};
  app.mixins = {};

  $(function(){
    app.collections.metrics = new app.collections.Metric();
    app.collections.dashboards = new app.collections.Dashboard();
    app.collections.instruments = new app.collections.Instrument();
    
    app.router = new app.Router();

    Backbone.history.start({pushState: true});
  });

})();