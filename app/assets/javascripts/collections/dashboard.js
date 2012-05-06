(function (collections, model) {

    collections.Dashboard = Backbone.Collection.extend({
    model: model,
    url: '/api/dashboards'
  });

})(app.collections, app.models.Dashboard);