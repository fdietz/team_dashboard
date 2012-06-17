(function ($, _, Backbone, Rickshaw, moment, views, collections){
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
      _.bindAll(this, "render", "update", "renderGraph", "showEmptyDatasetNotice", "updateValues", "widgetChanged");
      this.range = this.model.get("range");
      console.log("range", this.range);
      this.from = $.TimeSelector.getFrom(this.range);
      this.to = $.TimeSelector.getCurrent();
      this.source = options.source;

      this.updateGraphCollection();

      // this.collection.on('change', this.render);
      // this.collection.on('reset', this.render);
      this.model.on('change', this.widgetChanged);

      this.renderer = 'line';
      this.currentColors = [];
    },

    updateGraphCollection: function() {
      this.collection = new collections.Graph({
        time: this.model.get('time'),
        targets: this.model.get('targets'),
        source: this.model.get('source'),
        from: this.from,
        to: this.to
      });
    },

    widgetChanged: function() {
      this.updateGraphCollection();
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
            color = $.ColorFactory.get();
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
      console.log("render")
      $(this.el).html(JST['templates/widgets/graph/show']({ time: this.model.get('time') }));

      this.$graph = this.$('.graph');
      this.$yAxis = this.$('.y-axis');
      
      this.updateValues();

      return this;
    },

    renderGraph: function(datapoints) {
      console.log("renderGraph");

      this.$graph.empty();
      this.$yAxis.empty();
      
      this.graph = new Rickshaw.Graph({
        element: this.$graph.get(0),
        renderer: this.renderer,
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

    update: function(callback) {
      console.log("update")
      var that = this;

      this.from = $.TimeSelector.getFrom(this.range);
      this.to = $.TimeSelector.getCurrent();
      this.collection.from = this.from;
      this.collection.to = this.to;

      return this.collection.fetch({suppressErrors: true}).done(this.updateValues);
    },

    updateValues: function() {
      console.log("updateValues")
      var datapoints = this.transformDatapoints();
      if (datapoints.hasData === true) {
        this.renderGraph(datapoints);
      } else {
        // this.showEmptyDatasetNotice();
      }
    },

    showEmptyDatasetNotice: function() {
      $(this.el).html("<p class='empty-data'>No data available.</p>");
    },

    changeRenderer: function(renderer) {
      this.graph.configure({ renderer: renderer });
      this.graph.update();
    },

    onClose: function() {
      // this.collection.off('change', this.render);
      // this.collection.off('reset', this.render);
      this.model.off('change', this.render);
    },

    timeUnit: function() {
      switch(this.range) {
      case "30-minutes":
        return { name: 'minute', seconds: 60*2*2, formatter: function(d) { return moment.utc(d).local().format("HH:mm"); }};
      case "60-minutes":
        return { name: 'minute', seconds: 60*4*2, formatter: function(d) { return moment.utc(d).local().format("HH:mm"); }};
      case "3-hours":
        return { name: 'hour', seconds: 60*4*3*2, formatter: function(d) { return moment.utc(d).local().format("HH:mm"); }};
      case "12-hours":
        return { name: 'hour', seconds: 60*4*12*2, formatter: function(d) { return moment.utc(d).local().format("HH:mm"); }};
      case "24-hours":
        return { name: 'hour', seconds: 60*4*24*2, formatter: function(d) { return moment.utc(d).local().format("HH:mm"); }};
      case "3-days":
        return { name: 'day', seconds: 60*4*24*3*2*2, formatter: function(d) { return moment.utc(d).local().format("MM-DD HH:mm"); }};
      case "7-days":
        return { name: 'day', seconds: 60*4*24*7*2*2, formatter: function(d) { return moment.utc(d).local().format("MM-DD"); }};
      case "4-weeks":
        return { name: 'week', seconds: 60*4*24*7*4*2, formatter: function(d) { return moment.utc(d).local().format("MM-DD"); }};

      default:
        alert("unknown rangeString: " + this.range);
      }
    }
  });

})($, _, Backbone, Rickshaw, moment, app.views, app.collections);