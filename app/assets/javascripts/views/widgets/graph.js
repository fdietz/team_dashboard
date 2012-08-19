(function ($, _, Backbone, Rickshaw, moment, views, collections, ColorFactory, TimeSelector){
  "use strict";

  var pastel = [
    '#239928',
    '#6CCC70',
    '#DEFFA1',
    '#DEFFA1',
    '#DEFFA1',
    '#362F2B',
    '#BFD657',
    '#FF6131',
    '#FFFF9D',
    '#BEEB9F',
    '#79BD8F',
    '#00A388'
  ].reverse();

  views.widgets.Graph = Backbone.View.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "update", "renderGraph", "updateValues", "widgetChanged");

      this.updateCollection();

      this.model.on('change', this.widgetChanged);

      this.currentColors = [];
    },

    from: function() {
      return TimeSelector.getFrom(new Date().getTime(), this.model.get('range'));
    },

    to: function() {
      return TimeSelector.getCurrent();
    },

    updateCollection: function() {
      this.collection = new collections.Datapoint({
        targets: this.model.get('targets'),
        source: this.model.get('source'),
        from: this.from(),
        to: this.to(),
        http_proxy_url: this.model.get("http_proxy_url")
      });
    },

    widgetChanged: function() {
      this.updateCollection();
      this.render();
    },

    transformDatapoints: function() {
      var that = this;
      var series = this.collection.toJSON();
      series.hasData = true;
      _.each(series, function(model, index) {
        if (model.color === undefined) {
          var color = null;
          if (that.currentColors[index] === undefined) {
            color = ColorFactory.get();
            that.currentColors.push(color);
          } else {
            color = that.currentColors[index];
          }
          model.color = color;
        }
        model.name = model.target;
        model.data = _.map(model.datapoints, function(dp) {
          return { x: dp[1], y: dp[0] || 0 }; // rickshaw.js doesn't handle null value
        });
        if (model.data.length === 0) {
          series.hasData = false;
        }
        delete model.datapoints;
        delete model.target;
      });

      return series;
    },

    render: function() {
      this.$el.html(JST['templates/widgets/graph/show']({ time: this.model.get('time') }));

      this.$graph = this.$('.graph');
      this.$yAxis = this.$('.y-axis');

      return this;
    },

    renderGraph: function(datapoints) {
      this.$graph.empty();
      this.$yAxis.empty();

      this.graph = new Rickshaw.Graph({
        element: this.$graph.get(0),
        renderer: this.model.get("graph_type") || "line",
        width: this.$graph.parent().width()-80,
        series: datapoints
      });
      this.graph.render();

       this.xAxis = new Rickshaw.Graph.Axis.Time({
        graph: this.graph,
        timeUnit: this.timeUnit()
      });
      this.xAxis.render();

      this.yAxis = new Rickshaw.Graph.Axis.Y({
        graph: this.graph,
        orientation: 'left',
        element: this.$yAxis.get(0)
      });
      this.yAxis.render();

      // TODO: HoverDetail binds two events. Find a way to unbind these events.
      var hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: this.graph,
        formatter: function(series, x, y) {
          var dateStr = window.moment.utc(new Date(x*1000)).local().format("YYYY-MM-DD HH:mm");
          var date = '<span class="date">' + dateStr + '</span>';
          var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
          var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
          return content;
        }
      });
    },

    update: function(callback) {
      var that = this;
      var options = { suppressErrors: true };

      this.updateCollection();
      return $.when(this.collection.fetch(options)).done(this.updateValues);
    },

    updateGraphSeries: function(datapoints) {
      var that = this;
      this.graph.series = datapoints;
      this.graph.series.active = function() {
        return that.graph.series.filter(function(s) {
          return !s.disabled;
        });
      };
    },

    updateValues: function() {
      var datapoints = this.transformDatapoints();
      if (datapoints.hasData === true && this.graph) {
        this.updateGraphSeries(datapoints);
        this.graph.render();
      } else {
        this.renderGraph(datapoints);
      }
    },

    onClose: function() {
      this.model.off('change', this.render);
    },

    sizeFactor: function() {
      switch(this.model.get("size")) {
        case "1":
          return 3;
        case "2":
          return 2;
        default:
          return 1;
      }
    },

    minuteTimeFormatter: function(d) {
      return moment.utc(d).local().format("HH:mm");
    },

    hourTimeFormatter: function(d) {
      return moment.utc(d).local().format("MM-DD HH:mm");
    },

    dayTimeFormatter: function(d) {
      return moment.utc(d).local().format("MM-DD");
    },

    timeUnit: function() {
      var sizeFactor = this.sizeFactor();
      var minute = 60;
      var hour = 8*minute;
      var day = 24*8*minute;
      switch(this.model.get('range')) {
      case "30-minutes":
        return { name: 'minute', seconds: 4*minute*sizeFactor, formatter: this.minuteTimeFormatter };
      case "60-minutes":
        return { name: 'minute', seconds: hour*sizeFactor, formatter: this.minuteTimeFormatter };
      case "3-hours":
        return { name: 'hour', seconds: 24*minute*sizeFactor, formatter: this.minuteTimeFormatter };
      case "12-hours":
        return { name: 'hour', seconds: 12*8*minute*sizeFactor, formatter: this.minuteTimeFormatter };
      case "24-hours":
        return { name: 'hour', seconds: day*sizeFactor, formatter: this.minuteTimeFormatter };
      case "3-days":
        return { name: 'day', seconds: 3*day*sizeFactor, formatter: this.hourTimeFormatter };
      case "7-days":
        return { name: 'day', seconds: 7*day*sizeFactor, formatter: this.dayTimeFormatter };
      case "4-weeks":
        return { name: 'week', seconds: 7*4*day*sizeFactor, formatter: this.dayTimeFormatter };
      default:
        throw "unknown rangeString: " + this.model.get('range');
      }
    }
  });

})($, _, Backbone, Rickshaw, moment, app.views, app.collections, app.helpers.ColorFactory, app.helpers.TimeSelector);