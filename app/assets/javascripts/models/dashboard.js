(function (models) {

  models.Dashboard = Backbone.Model.extend({
    urlRoot: '/api/dashboards',

    defaults: {
      "name"        : "Undefined name",
      "instruments" : []
    },

    instrumentNames: function() {
      _.map(this.get("instruments"), function(instrument) {
        return instrument.name;
      });
    }
    
  });

})(app.models);