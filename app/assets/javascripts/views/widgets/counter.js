(function (views, collections){

  views.widgets.Counter = Backbone.View.extend({

    initialize: function(options) {
      _.bindAll(this, "render");

      this.collection = new collections.Graph({
        time: this.model.get('time'),
        targets: this.model.get('targets')
      });

      this.collection.on('change', this.render);
      this.collection.on('reset', this.render);
      this.model.on('change', this.widgetChanged);
    },

    widgetChanged: function() {
      this.collection = new collections.Graph({
        time: this.model.get('time'),
        targets: this.model.get('targets')
      });
    },

    value: function() {
      var result = this.collection.map(function(model) {
        return _.last(model.get('datapoints'));
      });

      var result2 = _.reduce(result, function(result, data) {
        return result + data[0];
      }, 0);

      console.log("result", result2);

      return result2;
    },

    rate: function() {
      return "0.37 %";
    },

    render: function() {
      console.log("render counter", this.model.toJSON());
      var that = this;
      if (!this.collection.isFetched) {
        this.update();
        return this;
      }

      $(this.el).html(JST['templates/widgets/counter/show']({ value: this.value(), rate: this.rate() }));
      return this;
    },

    update: function(callback) {
      var that = this;

      this.collection.fetch({
        success: function(model, response) {
          console.log("update success", model);
        },
        error: function(model, response) {
          console.log("error updating widget", response);
          that.showLoadingError();
        },
        complete: function(model, response) {
          that.hideAjaxSpinner();
          if (callback) { callback(); }
        },
        suppressErrors: true
      });
    },

    hideAjaxSpinner: function() {
      $(this.el).parent().parent().find(".ajax-spinner").hide();
    },

    showLoadingError: function() {
      $(this.el).html("<div><p>Error loading datapoints...</p></div>");
    },

    onClose: function() {
      this.collection.off('change', this.render);
      this.collection.off('reset', this.render);
      this.model.off('change', this.render);
    }
  });

})(app.views, app.collections);