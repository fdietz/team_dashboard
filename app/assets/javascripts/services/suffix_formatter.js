app.factory("SuffixFormatter", function() {

  // as defined by http://en.wikipedia.org/wiki/Metric_prefix
  var formatFn = function(val, digits) {
    var negative = val < 0 ? true : false;
    val = parseFloat(val);
    val = Math.abs(val);

    var result = null;
    if (val > 1000000000) {
      result = Math.round(val/1000000000) + "G";
    } else if (val >= 1000000) {
      result = Math.round(val/1000000) + "M";
    } else if (val >= 1000) {
      result = Math.round(val/1000) + "k";
    } else if (val < 1.0) {
      result = parseFloat(Math.round(val * 100) / 100).toFixed(2);
    } else {
      val = val % 1 === 0 ? val.toString() : val.toFixed(digits);
      result = val;
    }

    if (negative) {
      result = "-" + result;
    }

    return result;
  };

  return {
    format: formatFn
  };
});