(function (models) {

  models.Dashboard = Backbone.Model.extend({
    urlRoot: '/api/dashboards',

    defaults: {
      "name"        : "Undefined name",
      "instruments" : []
    }
        
  });

})(app.models);