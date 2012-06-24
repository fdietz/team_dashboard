(function ($, _, Backbone, views) {
  "use strict";

  views.Metrics = Backbone.View.extend({

    events: {
      "click .source-picker": "switchSource"
    },

    initialize: function() {
      _.bindAll(this, "render", "switchSource");
      this.collection.on('reset', this.render);
    },

    render: function() {
      this.$el.html(JST['templates/metrics/index']({ metrics: this.collection.toJSON(), source: this.collection.source }));

      if (!this.collection.isFetched) {
        this.collection.fetch();
        return this;
      }

      return this;
    },

    switchSource: function(event) {
      var button = this.$(event.target);
      var source = button.attr("data-source");
      this.collection.source = source;
      this.collection.fetch();
    }
  });

})($, _, Backbone, app.views);
