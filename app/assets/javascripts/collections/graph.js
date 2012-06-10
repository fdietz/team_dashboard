(function (collections, model) {

    collections.Graph = Backbone.Collection.extend({
      model: model,

      initialize: function(options) {
        this.targets = options.targets;
        this.time = options.time || 'minute';
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

      buildTimeParams: function() {
        return "time=" + this.time;
      },

      url: function() {
        var params = [this.buildTargetsParams(), this.buildTimeParams()];
        return "/api/graph?" + params.join('&');
      }

    });

})( app.collections, app.models.Graph);