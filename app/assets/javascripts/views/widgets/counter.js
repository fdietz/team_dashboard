(function ($, _, Backbone, views, collections){
  "use strict";

  views.widgets.Counter = Backbone.View.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "value", "rate");

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

      return result2;
    },

    rate: function() {
      return "30.37 %";
    },

    render: function() {
      var that = this;
      if (!this.collection.isFetched) {
        this.update();
        return this;
      }

      $(this.el).html(JST['templates/widgets/counter/show']({ value: this.value(), rate: this.rate() }));

      var str = this.value().toString().length;
      console.log("this.value().length", str, str.length);
      if (str <= 5) {
        this.$(".value").addClass("value-size-large");
      } else if (str > 5 && str < 8) {
        this.$(".value").addClass("value-size-medium");
      } else {
        this.$(".value").addClass("value-size-small");
      }
      return this;
    },

    update: function(callback) {
      var that = this;

      this.collection.fetch({
        success: function(model, response) {},
        error: function(model, response) { that.showLoadingError(); },
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

})($, _, Backbone, app.views, app.collections);
