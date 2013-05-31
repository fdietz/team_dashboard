app.factory("FlotrGraphHelper", ["ColorFactory", "SuffixFormatter", "$window", function(ColorFactory, SuffixFormatter, $window) {

  // TODO: refactor
  function timeUnit(range, size) {
    switch(range) {
    case "30-minutes":
    case "60-minutes":
    case "3-hours":
    case "12-hours":
    case "24-hours":
    case "today":
    case "yesterday":
      return "%H:%M";
    case "3-days":
      if (size === 1) {
        return "%m-%d";
      } else {
        return "%m-%d %H:%M";
      }
      break;
    case "7-days":
    case "this-week":
    case "previous-week":
    case "4-weeks":
    case "this-month":
    case "previous-month":
      return "%m-%d";
    case "this-year":
    case "previous-year":
      return "%m-%y";
    default:
      throw "unknown rangeString: " + range;
    }
  }

  function suffixFormatter(val, axis) {
    return SuffixFormatter.format(val, axis.tickDecimals);
  }

  function formatDate(date) {
    return $window.moment.utc(new Date(date)).local().format("YYYY-MM-DD HH:mm");
  }

  function trackFormatterFn(obj) {
    var data = {
      date: formatDate(obj.x * 1000),
      color: obj.series.color,
      label: obj.series.label,
      value: parseInt(obj.y, 10)
    };

    var html = '<span class="detail_swatch" style="background-color: {{color}}"></span>' +
               '{{label}}:{{value}}<br>' +
               '<span class="date">{{date}}</span>';

    return _.template(html, data);
  }

  function defaultOptions(model) {
    return {
      shadowSize: 1,
      grid: {
        outline: "", verticalLines: false, horizontalLines: false, labelMargin: 10
      },
      xaxis: {
        mode: "time", timeMode: "local", timeUnit: 'second', timeFormat: timeUnit(model.range, parseInt(model.size, 10))
      },
      yaxis: {
        tickFormatter: suffixFormatter,
        max: model.max || null
      },
      legend: {
        show: model.display_legend || false, labelBoxBorderColor: null, position: "ne"
      },
      mouse: {
        track: true, relative: true, sensibility: 5, lineColor: "#ccc", trackFormatter: trackFormatterFn
      }
    };
  }

  // reuse the same color for the same target
  function initColor(currentColors, index) {
    var color = null;
    if (!currentColors[index]) {
      color = ColorFactory.get();
      currentColors.push(color);
    } else {
      color = currentColors[index];
    }
    return color;
  }

  // swap x/y values since backend and flotr2 define it different
  function swapDatapoints(datapoints) {
    return _.map(datapoints, function(dp) {
      return [dp[1], dp[0]];
    });
  }

  function linesType(graph_type) {
    switch(graph_type) {
      case "area":
        return true;
      case "stacked":
        return true;
      case "line":
        return false;
      default:
        return false;
    }
  }

  function transformSeriesOfDatapoints(series, widget, currentColors) {
    return _.map(series, function(model, index) {
      return {
        color: initColor(currentColors, index),
        lines: { fill: linesType(widget.graph_type), lineWidth: 1 },
        label: model.target,
        data : swapDatapoints(model.datapoints)
      };
    });
  }

  return {
    defaultOptions: defaultOptions,
    transformSeriesOfDatapoints: transformSeriesOfDatapoints
  };
}]);