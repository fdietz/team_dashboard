app.filter("dollar", function() {
  return function(input) {
    if (!input) return "";

    return "$ " + input;
  };
});