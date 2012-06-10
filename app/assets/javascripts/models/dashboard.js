(function (models) {

  models.Dashboard = Backbone.Model.extend({
    urlRoot: '/api/dashboards',

    defaults: {
      "name"        : "Undefined name"
    }
        
  });

})(app.models);