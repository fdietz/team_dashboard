(function (views, collections){

  views.Metric = Backbone.View.extend({

    events: {
      "click .time": "switchTime"
    },

    initialize: function() {
      _.bindAll(this, "render");
      this.time = "hour";
    },

    render: function() {
      $(this.el).html(JST['templates/metrics/show']({ metric: this.model.toJSON() }));

      var button = this.$("button[data-time='"+this.time+ "']");
      button.addClass("active");

      var metricName = this.model.get('name');
      var targets = [metricName];
      var graphCollection = new collections.Graph({
        targets: targets,
        time: this.time
      });

      
      graphCollection.fetch({
        success: function(collection, request) {
          var hasData = _.any(collection.toJSON(), function(series) {
            return series.data.length > 0;
          });

          if (hasData) {
            var graphView = new views.Graph({
              metrics: targets, series: collection.toJSON(), time: this.time, el: this.$("#graph-container")
            });
            graphView.render();
          } else {
            console.log("no graph data available");
            this.$("#graph-container").html("<p>No Graph data available in this time frame</p>");
          }
        }
      });

      return this;
    },

    switchTime: function(event) {
      var button = this.$(event.target);
      this.time = button.attr("data-time");
      this.render();
    }

  });

})(app.views, app.collections);