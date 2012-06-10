(function (views) {

  views.Metrics = Backbone.View.extend({
    
    initialize: function() {
      _.bindAll(this, "render");

      this.collection.on('reset', this.render);
    },

    render: function() {
      $(this.el).html(JST['templates/metrics/index']({ metrics: this.collection.toJSON() }));

      if (!this.collection.isFetched) {
        this.collection.fetch();
        return this;
      }

      return this;
    }
  });

})(app.views);