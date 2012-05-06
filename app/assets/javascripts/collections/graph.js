(function (collections, model) {

    collections.Graph = Backbone.Collection.extend({
      model: model,

      initialize: function(options) {
        this.targets = options.targets;
        this.time = options.time;
      },

      buildTargetsParams: function() {
        var result = _.map(this.targets, function(target) {
          return "targets[]="+target;
        });
        return result.join("&");
      },

      buildTimeParams: function() {
        return "time="+ this.time;
      },

      url: function() {
        var params = [this.buildTargetsParams(), this.buildTimeParams()];
        return "/api/graph?"+params.join('&');
      }

    });

})( app.collections, app.models.Graph);