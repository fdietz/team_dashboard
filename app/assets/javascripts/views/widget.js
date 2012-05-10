(function (views, models, collections) {

  views.Widget = Backbone.View.extend({
    tagName: "div",
    className: "widget span6",

    events: {
      "click button.widget-delete" : "removeWidget"
    },

    initialize: function(options) {
      _.bindAll(this, "render");
      this.dashboard = options.dashboard;
      console.log("init dash", this.dashboard);
    },

    renderGraph: function(graphElement) {
      var time = "hour";
      var targets = _.map(this.model.get('metrics'), function(metric) {
        return metric.name;
      });

      var hourGraphCollection = new collections.Graph({
        targets: targets,
        time: time
      });

      var metrics = this.model.get('metrics');
      hourGraphCollection.fetch({ 
        success: function(collection, response) {
          var hasData = _.any(collection.toJSON(), function(series) {
            return series.data.length > 0;
          });

          if (hasData) {
            graph = new views.Graph({ metrics: metrics, series: collection.toJSON(), time: time, el: graphElement });
            graph.render();
          } else {
            console.log("no graph data available");
            graphElement.html("<p>No Graph data available in this time frame</p>");
          }
        }
      });
    },

    render: function() {
      $(this.el).html(JST['templates/widgets/show']({ instrument: this.model.toJSON() }));
      this.renderGraph(this.$(".graph-container"));
      return this;
    },

    removeWidget: function(event) {
      var tmp = this.dashboard.get("instruments");
      tmp.splice(_.indexOf(tmp, this.model.id), 1);

      this.dashboard.set({ instruments: tmp });
      var result = this.dashboard.save({ 
        success: function(model, request) {
          console.log("saved model: ", model);
        },
        error: function(model, request) {
          alert("failed saving model "+request);
        }
      });

      this.remove();
      this.unbind();
    }

  });

})(app.views, app.models, app.collections);