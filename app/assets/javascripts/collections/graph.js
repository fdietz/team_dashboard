(function (collections, model) {

    collections.Graph = Backbone.Collection.extend({
      model: model,

      initialize: function(options) {
        this.targets = options.targets;
        this.time = options.time || 'minute';
      },

      buildTargetsParams: function() {
        return _.map(this.targets, function(target) {
          return "targets[]="+target;
        }).join('&');
      },

      buildTimeParams: function() {
        return "time="+ this.time;
      },

      url: function() {
        var params = [this.buildTargetsParams(), this.buildTimeParams()];
        return "/api/graph?" + params.join('&');
      }

    });

})( app.collections, app.models.Graph);