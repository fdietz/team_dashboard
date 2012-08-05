(function ($, _, Backbone, models) {
  "use strict";

  models.Counter = Backbone.Model.extend({
    initialize: function(options) {
      this.targets = options.targets;
      this.from = options.from;
      this.to = options.to;
      this.source = options.source;
      this.targetsArray = (this.targets || "").split(',');
      this.aggregate_function = options.aggregate_function;
    },

    buildTargetsParams: function() {
      return _.map(this.targetsArray, function(target) {
        return "targets[]=" + encodeURIComponent(target);
      }).join('&');
    },

    buildDateRangeParams: function() {
      var result = "from=" + encodeURIComponent(this.from) + "&to=" + encodeURIComponent(this.to);
      return result;
    },

    url: function() {
      var params = [this.buildTargetsParams(), this.buildDateRangeParams(), 'source=' + encodeURIComponent(this.source)];
      if (this.aggregate_function) {
        params.push("aggregate_function=" + this.aggregate_function);
      }
      return "/api/counter?" + params.join('&');
    }

  });

})($, _, Backbone, app.models);
