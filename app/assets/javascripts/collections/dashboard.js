(function (collections, model) {

    collections.Dashboard = Backbone.Collection.extend({
      model: model,
      url: '/api/dashboards',

      initialize: function() {
        this.isFetched = false;
        this.bind('reset', this.onReset, this);
      },

      onReset: function() {
        this.isFetched = true;
      }
    });

})(app.collections, app.models.Dashboard);