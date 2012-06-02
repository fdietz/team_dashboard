( function (views){

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


  function timeUnit(time) {
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

  views.Graph = Backbone.View.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "update", "changeRenderer");
      this.time = this.options.time;
      this.series = this.options.series;
      this.metrics = this.options.metrics;
      this.renderer = this.options.renderer || 'line';
    },

    render: function() {
      $(this.el).html(JST['templates/graphs/show']({ time: this.time }));

      var that = this;
      _.each(this.series, function(serie, index) {
        if (serie.name === that.metrics[index].name) {
          serie.color = that.metrics[index].color;
        }
      });

      _.each(this.series, function(data) {
        if (data.color === undefined) {
          data.color = pastel[Math.floor(Math.random() * pastel.length)];
        }
      });

      this.graph = new Rickshaw.Graph({
        element: this.$('.graph').get(0),
        renderer: this.renderer,
        width: this.$('.graph').parent().width()-80,
        series: this.series
      });

      
      this.graph.render();

      var xAxis = new Rickshaw.Graph.Axis.Time({
        graph: this.graph,
        timeUnit: timeUnit(this.time)
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

    update: function(series) {
      this.series = series;
      if (this.graph) {
        this.graph.update();
      }
    },

    changeRenderer: function(renderer) {
      this.graph.configure({
        renderer: renderer
      });
      this.graph.update();
    }
  });

})( app.views );