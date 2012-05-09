(function (views){

  views.Instruments = Backbone.View.extend({
    events: {
      "click .create-metric": "createMetric"
    },

    initialize: function(options) {
      _.bindAll(this, "render");
    },

    render: function() {
      $(this.el).html(JST['templates/instruments/index']({ instruments: this.collection.toJSON() }));
      return this;
    },

    createMetric: function() {
      console.log("createMetric");
      var model = new app.models.Instrument();
      model.save({}, {
        success: function(model, request) {
          console.log("model", model);
          window.app.router.navigate("/metrics/" + model.id, { trigger: true });
        },
        error: function(model, request) {
          alert(request);
        }
      });
    }
  });

})(app.views);