(function ($, _, Backbone, collections, model) {
  "use strict";

    collections.Datapoint = Backbone.Collection.extend({
      model: model,

      initialize: function(options) {
        this.targets        = options.targets;
        this.from           = options.from;
        this.to             = options.to;
        this.source         = options.source;
        this.targetsArray   = (this.targets || "").split(';');

        this.isFetched = false;
        this.bind('reset', this.onReset, this);
      },

      onReset: function() {
        this.isFetched = true;
      },

      buildTargetsParams: function() {
        // filter out blanks TODO: check why this happens in the first place
        var result = _.reject(this.targetsArray, function(e) {
          return e.length === 0;
        });
        return _.map(result, function(target) {
          return "targets[]=" + encodeURIComponent(target);
        }).join('&');
      },

      buildDateRangeParams: function() {
        var result = "from=" + encodeURIComponent(this.from) + "&to=" + encodeURIComponent(this.to);
        return result;
      },

      url: function() {
        var params = [this.buildTargetsParams(), this.buildDateRangeParams(), 'source=' + encodeURIComponent(this.source)];
        if (this.http_proxy_url) {
          params.push("http_proxy_url=" + encodeURIComponent(this.http_proxy_url));
        }
        return "/api/datapoints?" + params.join('&');
      }

    });

})( $, _, Backbone, app.collections, app.models.Datapoint);
