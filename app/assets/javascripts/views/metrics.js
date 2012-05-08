(function (views) {

  views.Metrics = Backbone.View.extend({
    
    initialize: function() {
      _.bindAll(this, "render");
    },

    render: function() {
      $(this.el).html(JST['templates/metrics/index']({ metrics: this.collection.toJSON() }));
      return this;
    }
  });

})(app.views);