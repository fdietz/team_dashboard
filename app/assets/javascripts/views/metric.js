(function (views, collections){

  views.Metric = Backbone.View.extend({

    initialize: function() {
      _.bindAll(this, "render");
    },

    render: function() {
      $(this.el).html(JST['templates/metrics/show']({ metric: this.model.toJSON() }));

      var targets = [this.model.get('name')];
      // TODO: make code more DRY
      var minuteGraphCollection = new collections.Graph({
        targets: targets,
        time: 'minute'
      });

      minuteGraphCollection.fetch({
        success: function() {
          var minuteView = new views.Graph({
            series: minuteGraphCollection.toJSON(),
            time: "minute",
            el: this.$("#graph-container-minute")
          });
          minuteView.render();
        }
      });

      var hourGraphCollection = new collections.Graph({
        targets: targets,
        time: 'hour'
      });

      hourGraphCollection.fetch({
        success: function() {
          var hourView = new views.Graph({
            series: hourGraphCollection.toJSON(),
            time: "hour",
            el: this.$("#graph-container-hour")
          });
          hourView.render();
        }
      });

      var dayGraphCollection = new collections.Graph({
        targets: targets,
        time: 'day'
      });

      dayGraphCollection.fetch({
        success: function() {
          var dayView = new views.Graph({
            series: dayGraphCollection.toJSON(),
            time: "day",
            el: this.$("#graph-container-day")
          });
          dayView.render();
        }
      });

      var weekGraphCollection = new collections.Graph({
        targets: targets,
        time: 'week'
      });

      weekGraphCollection.fetch({
        success: function() {
          var weekView = new views.Graph({
            series: weekGraphCollection.toJSON(),
            time: "week",
            el: this.$("#graph-container-week")
          });
          weekView.render();
        }
      });

      return this;
    }
  });

})(app.views, app.collections);