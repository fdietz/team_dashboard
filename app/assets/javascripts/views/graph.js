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

  /*
  var customPalette = new Rickshaw.Color.Palette( { scheme: pastel } );
  var spectrum14Palette = new Rickshaw.Color.Palette( { scheme: "spectrum14" } );
  */

  /*
  function addColorToSeries(data, palette) {
    var result = [];
    $.each(data, function(k, v){
      v.color = palette.color();
      result.push(v);
    });
    return result;
  }
  */

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
      _.bindAll(this, "render");
      this.time = this.options.time;
      this.series = this.options.series;
      this.metrics = this.options.metrics;
    },

    render: function() {
      $(this.el).html(JST['templates/graphs/show']({ time: this.time }));

      console.log(this.series, this.metrics);

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

      var graph = new Rickshaw.Graph({
        element: this.$('.graph').get(0),
        renderer: 'line',
        width: this.$('.graph').parent().width()-200,
        // height: this.$('.graph').parent().height(),
        //series: addColorToSeries(this.series, spectrum14Palette)
        series: this.series
      });

      var x_axis = new Rickshaw.Graph.Axis.Time({
        graph: graph,
        timeUnit: timeUnit(this.time)
      });

      // var y_axis = new Rickshaw.Graph.Axis.Y({
      //   graph: graph,
      //   orientation: 'left',
      //   tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
      //   element: this.$('.y-axis').get(0)
      // });

      graph.render();

      var hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: graph
      });

      $(window).resize(function() {
        console.log("resize");
        var width = this.$('.graph').parent().width()-100;
        graph.width = width;
        graph.update();
      });

      return this;
    }
  });

})( app.views );