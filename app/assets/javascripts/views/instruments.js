(function (views){

  views.Instruments = Backbone.View.extend({
    // template: Handlebars.compile($("#instrument-list").html()),

    initialize: function(options) {
      _.bindAll(this, "render");
      // this.collection.bind('reset', this.render);
    },

    render: function() {
      $(this.el).html(JST['templates/instruments/index']({ instruments: this.collection.toJSON() }));
      return this;
    }
  });

})(app.views);