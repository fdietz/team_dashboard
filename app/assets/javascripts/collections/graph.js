(function (collections, model) {

    collections.Graph = Backbone.Collection.extend({
      model: model,

      initialize: function(options) {
        this.targets = options.targets;
        this.from = options.from;
        this.to = options.to;
        this.at = options.at;

        console.log("from", this.from, "to", this.to, "at", this.at);
        this.targetsArray = (this.targets || "").split(',');

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
        var result = null;
        if (this.at) {
          result = "at=" + this.at;
        } else {
          result = "from=" + this.from + "&to=" + this.to;
        }
        return result;
      },

      url: function() {
        var params = [this.buildTargetsParams(), this.buildDateRangeParams()];
        console.log("params", params);
        return "/api/graph?" + params.join('&');
      }

    });

})( app.collections, app.models.Graph);