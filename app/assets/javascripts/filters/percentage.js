app.filter("percentage", function() {
  return function(input) {
    if (_.isUndefined(input) || _.isNull(input)) return "";

    var result = null;

    if ( input % 1 === 0) {
      result = input;
    } else {
      result =  input.toFixed(2);
    }
    return result + " %";
  };
});