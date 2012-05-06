(function (models) {

  models.Dashboard = Backbone.Model.extend({
    urlRoot: '/api/dashboards'
  });

})(app.models);