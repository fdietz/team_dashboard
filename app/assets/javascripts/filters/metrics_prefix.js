app.filter("metricsPrefix", ["SuffixFormatter", function(SuffixFormatter) {
  return function(input) {
    if (_.isUndefined(input) || _.isNull(input)) return "";

    return SuffixFormatter.format(input, 2);
  };
}]);
