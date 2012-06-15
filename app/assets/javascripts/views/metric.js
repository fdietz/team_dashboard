(function ($, _, Backbone, moment, views, collections){
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


  var Graph = Backbone.View.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "renderGraph", "transformDatapoints");

      this.targets = options.targets;
      this.from = options.from;
      this.to = options.to;
      this.range = options.range;
      this.collection = new collections.Graph({
        targets: this.targets,
        from: this.from,
        to: this.to
      });
      this.collection.on('reset', this.render);

      this.renderer = 'line';
    },

    update: function(from, to, range) {
      this.from = from;
      this.to = to;
      this.range = range;

      console.log("update graph", new Date(this.from*1000), new Date(this.to*1000));
      this.collection.from = from;
      this.collection.to = to;
      this.collection.fetch();
    },

    transformDatapoints: function() {
      var series = this.collection.toJSON();
      series.hasData = true;
      _.each(series, function(model, index) {
        if (model.color === undefined) {
          model.color = pastel[Math.floor(Math.random() * pastel.length)];
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
      $(this.el).html(JST['templates/widgets/line_graph/show']({ time: this.time }));

      if (!this.collection.isFetched) {
        this.collection.fetch();
        return this;
      }

      var datapoints = this.transformDatapoints();
      if (datapoints.hasData === true) {
        console.log("datapoints total", datapoints.length);
        console.log("datapoints", datapoints);
        this.renderGraph(datapoints);
      } else {
        this.showEmptyDatasetNotice();
      }

      return this;
    },

    showEmptyDatasetNotice: function() {
      $(this.el).html("<p>No data available.</p>");
    },

    renderGraph: function(datapoints) {
      this.graph = new Rickshaw.Graph({
        element: this.$('.graph').get(0),
        renderer: this.renderer,
        width: this.$('.graph').parent().width()-80,
        series: datapoints
      });

      this.graph.render();

      var xAxis = new Rickshaw.Graph.Axis.Time({
        graph: this.graph,
        timeUnit: this.timeUnit()
      });
      xAxis.render();

      var yAxis = new Rickshaw.Graph.Axis.Y({
        graph: this.graph,
        orientation: 'left',
        element: this.$('.y-axis').get(0)
      });
      yAxis.render();

      var hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: this.graph,
        formatter: function(series, x, y) {
          var dateStr = window.moment.utc(new Date(x*1000)).local().format("YYYY-MM-DD h:mm a");
          var date = '<span class="date">' + dateStr + '</span>';
          var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
          var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
          return content;
        }
      });
    },

    onClose: function() {
      // this.collection.off('change', this.render);
      this.collection.off('reset', this.render);
      // this.model.off('change', this.render);
    },

    timeUnit: function() {
      switch(this.range) {
      case "30-minutes":
        return { name: 'minute', seconds: 60*2, formatter: function(d) { return moment.utc(d).local().format("HH:mm"); }};
      case "60-minutes":
        return { name: 'minute', seconds: 60*4, formatter: function(d) { return moment.utc(d).local().format("HH:mm"); }};
      case "3-hours":
        return { name: 'hour', seconds: 60*4*3, formatter: function(d) { return moment.utc(d).local().format("HH:mm"); }};
      case "12-hours":
        return { name: 'hour', seconds: 60*4*12, formatter: function(d) { return moment.utc(d).local().format("HH:mm"); }};
      case "24-hours":
        return { name: 'hour', seconds: 60*4*24, formatter: function(d) { return moment.utc(d).local().format("HH:mm"); }};
      case "3-days":
        return { name: 'day', seconds: 60*4*24*3*2, formatter: function(d) { return moment.utc(d).local().format("MM-DD HH:mm"); }};
      case "7-days":
        return { name: 'day', seconds: 60*4*24*7*2, formatter: function(d) { return moment.utc(d).local().format("MM-DD"); }};
      case "4-weeks":
        return { name: 'week', seconds: 60*4*24*7*4, formatter: function(d) { return moment.utc(d).local().format("MM-DD"); }};

      default:
        alert("unknown rangeString: " + this.range);
      }
    }
  });

  views.Metric = Backbone.View.extend({

    events: {
      "click .date-range-picker": "switchDateRange"
    },

    initialize: function() {
      _.bindAll(this, "render", "switchDateRange");
      this.time = 'hour';
      this.range = "30-minutes";
      this.from = $.TimeSelector.getFrom(this.range);
      this.to = $.TimeSelector.getCurrent();
    },

    render: function() {
      $(this.el).html(JST['templates/metrics/show']({ metric: this.model.toJSON() }));

      // this.$("button.data-time").button();

      this.$('.dropdown-toggle').dropdown();

      this.graph = new Graph({ targets: this.model.get('name'), from: this.from, to: this.to, range: this.range });
      this.graph.render();
      this.$("#graph-container").html(this.graph.el);

      return this;
    },

    switchDateRange: function(event) {
      var button = this.$(event.target);
      this.range = button.attr("data-range");
      // button.button("toggle");
      console.log("switchTime", this.range );

      this.from = $.TimeSelector.getFrom(this.range);
      this.to = $.TimeSelector.getCurrent();

      this.graph.update(this.from, this.to, this.range);
    }

  });

})($, _, Backbone, moment, app.views, app.collections);
