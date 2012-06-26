(function ($, _, Backbone, collections, model) {
  "use strict";

    collections.Graph = Backbone.Collection.extend({
      model: model,

      initialize: function(options) {
        this.targets = options.targets;
        this.from = options.from;
        this.to = options.to;
        this.source = options.source;
        this.targetsArray = (this.targets || "").split(',');
        this.aggregate_function = options.aggregate_function;

        this.isFetched = false;
        this.bind('reset', this.onReset, this);
      },

      onReset: function() {
      this.isFetched = true;
    },

      buildTargetsParams: function() {
        return _.map(this.targetsArray, function(target) {
          return "targets[]="+target;
        }).join('&');
      },

      buildDateRangeParams: function() {
        var result = "from=" + this.from + "&to=" + this.to;
        return result;
      },

      url: function() {
        var params = [this.buildTargetsParams(), this.buildDateRangeParams(), 'source=' + this.source];
        if (this.aggregate_function) {
          params.push("aggregate_function=" + this.aggregate_function);
        }
        return "/api/datapoints?" + params.join('&');
      }

    });

})( $, _, Backbone, app.collections, app.models.Graph);
