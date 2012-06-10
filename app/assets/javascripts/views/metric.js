(function (views, collections){

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
      _.bindAll(this, "render", "datapoints");

      this.time = options.time || 'minute';
      this.targets = options.targets;
      this.collection = new collections.Graph({
        targets: this.targets,
        time: this.time
      });
      this.collection.on('reset', this.render);
      
      this.renderer = 'line';
    },

    update: function(time) {
      this.time = time;
      this.collection.time = this.time;
      this.collection.fetch();
    },

    datapoints: function() {
      var series = this.collection.toJSON();
      _.each(series, function(model, index) {
        if (model.color === undefined) {
          model.color = pastel[Math.floor(Math.random() * pastel.length)];
        }
        model.name = model.target;
        model.data = _.map(model.datapoints, function(dp) {
          return { x: dp[1], y: dp[0] };
        });
        model.datapoints = null;
      });
      return series;
    },

    render: function() {
      console.log("metric graph render");

      $(this.el).html(JST['templates/widgets/line_graph/show']({ time: this.time }));

      if (!this.collection.isFetched) {
        this.collection.fetch();
        return this;
      }

      this.graph = new Rickshaw.Graph({
        element: this.$('.graph').get(0),
        renderer: this.renderer,
        width: this.$('.graph').parent().width()-80,
        series: this.datapoints()
      });
      
      this.graph.render();

      var xAxis = new Rickshaw.Graph.Axis.Time({
        graph: this.graph,
        timeUnit: this.timeUnit(this.time)
      });
      xAxis.render();

      var yAxis = new Rickshaw.Graph.Axis.Y({
        graph: this.graph,
        orientation: 'left',
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
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

      return this;
    },

    onClose: function() {
      // this.collection.off('change', this.render);
      this.collection.off('reset', this.render);
      // this.model.off('change', this.render);
    },

    timeUnit: function(time) {
      var timeFixture = new Rickshaw.Fixtures.Time();

      var minuteCustom = {
        name: 'minute',
        seconds: 60,
        formatter: function(d) { return moment.utc(d).local().format("HH:mm"); }
      };
      var hourCustom = {
        name: 'hour',
        seconds: 60*15,
        formatter: function(d) { return moment.utc(d).local().format("HH:mm"); }
      };
      var dayCustom = {
        name: 'day',
        seconds: 60*60*4,
        formatter: function(d) { return moment.utc(d).local().format("HH"); }
      };
      var weekCustom = {
        name: 'week',
        seconds: 60*60*2*7*2,
        formatter: function(d) { return moment.utc(d).local().format("MM-DD"); }
      };

      switch(time){
        case 'minute': return minuteCustom;
        case 'hour': return hourCustom;
        case 'day': return dayCustom;
        case 'week': return weekCustom;
      }
    }
  });

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

      this.graph = new Graph({ targets: this.model.get('name'), time: this.time });
      this.graph.render();
      this.$("#graph-container").html(this.graph.el);

      return this;
    },

    switchTime: function(event) {
      console.log("switchTime");
      var button = this.$(event.target);
      this.time = button.attr("data-time");
      this.graph.update(this.time);
    }

  });

})(app.views, app.collections);