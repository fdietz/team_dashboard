(function (views){

  views.Dashboards = Backbone.View.extend({
    // template: Handlebars.compile($("#dashboard-list").html()),

    initialize: function(options) {
      _.bindAll(this, "render");
      // this.collection.bind('reset', this.render);  
    },

    render: function() {
      $(this.el).html(JST['templates/dashboards/index']({ dashboards: this.collection.toJSON() }));
      return this;
    }
  });

})(app.views);