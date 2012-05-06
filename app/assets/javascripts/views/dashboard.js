( function ( views ){

  views.Dashboard = Backbone.View.extend({
    // template: Handlebars.compile($("#dashboard-details").html()),

    initialize: function(options) {
      _.bindAll(this, "render");
      this.model.bind('reset', this.render);
    },

    render: function() {
      $(this.el).html(JST['templates/dashboards/show']({ dashboard: this.model.toJSON() }));
      return this;
    }
  });

})(app.views);