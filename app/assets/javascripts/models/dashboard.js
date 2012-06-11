(function (models) {

  models.Dashboard = Backbone.Model.extend({
    urlRoot: '/api/dashboards',

    defaults: {
      "name"        : "Undefined name"
    },

    updateLayout: function(widgetId) {
      console.log(this.get('layout'));
      if ( _.indexOf(this.get('layout'), widgetId) === -1) {
        this.get('layout').push(widgetId);
      }
    }
        
  });

})(app.models);