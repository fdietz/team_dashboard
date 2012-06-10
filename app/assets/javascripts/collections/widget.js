(function (collections, model) {

    collections.Widget = Backbone.Collection.extend({
      model: model,

      initialize: function(options) {
        this.dashboard_id = options.dashboard_id;
      },

      url: function() {
        return "/api/dashboards/" + this.dashboard_id + "/widgets";
      }

  });

})(app.collections, app.models.Widget);