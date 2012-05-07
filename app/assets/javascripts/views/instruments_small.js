(function (views){

  views.InstrumentsSmall = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "render");
      this.collection.bind('reset', this.render);
    },

    render: function() {
      $(this.el).html(JST['templates/instruments/index_small']({ instruments: this.collection.toJSON() }));
      return this;
    }
  });

})(app.views);