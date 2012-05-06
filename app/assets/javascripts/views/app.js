(function (views){

  views.App = Backbone.View.extend({

    initialize: function(options) {
      _.bindAll(this, "render");
      this.collection.bind('reset', this.render);
    },
    
    render: function() {
      $(this.el).html(JST['templates/metrics/index']({ metrics: this.collection.toJSON() }));

      return this;
    }
  });

})(app.views);