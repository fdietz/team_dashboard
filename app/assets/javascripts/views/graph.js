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
      formatter: function(d) { return d.getUTCHours()+':'+d.getUTCMinutes()+'h';}
    };
    var hourCustom = {
      name: 'hour',
      seconds: 60*15,
      formatter: function(d) { return d.getUTCHours()+':'+d.getUTCMinutes()+'h';}
    };
    var dayCustom = {
      name: 'day',
      seconds: 60*60*2,
      formatter: function(d) { return d.getUTCHours()+'h';}
    };
    var weekCustom = {
      name: 'week',
      seconds: 60*60*2*7*2,
      formatter: function(d) { return d.getUTCDate()+'. '+d.getUTCMonth()+'.';}
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
          serie.color = that.metrics[index].color
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
        width: this.$('.graph').parent().width()-200,
        height: this.$('.graph').parent().height(),
        //series: addColorToSeries(this.series, spectrum14Palette)
        series: this.series
      });

      var xAxis = new Rickshaw.Graph.Axis.Time({
        graph: this.graph,
        timeUnit: timeUnit(this.time)
      });


      // var yAxis = new Rickshaw.Graph.Axis.Y({
      //   graph: this.graph,
      //   orientation: 'left',
      //   tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
      //   element: this.$('.y-axis').get(0)
      // });

      this.graph.render();
      //xAxis.render();

      var hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: this.graph
      });

      /*
      $(window).resize(function() {
        console.log("resize");
        var width = this.$('.graph').parent().width()-100;
        this.graph.width = width;
        this.graph.update();
      });
      */

      return this;
    },

    update: function(series) {
      this.series = series;
      this.graph.update();
    },

    changeRenderer: function(renderer) {
      this.graph.configure({
        renderer: renderer
      });
      this.graph.update();
    }
  });

})( app.views );