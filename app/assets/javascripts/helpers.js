(function() {

  //  return the first item of a list only
  // usage: {{#first items}}{{name}}{{/first}}
  Handlebars.registerHelper('first', function(context, block) {
    return block(context[0]);
  });

  //  format an ISO date using Moment.js
  //  http://momentjs.com/
  //  moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
  //  usage: {{dateFormat creation_date format="MMMM YYYY"}}
  Handlebars.registerHelper('dateFormat', function(context, block) {
    if (window.moment) {
      var f = block.hash.format || "YYYY-MM-DD h:mm a";
      return moment.utc(context, "YYYY-MM-DD hh:mm:ss z").local().format(f);
    } else {
      return context;   //  moment plugin not available. return data as is.
    }
  });

})();