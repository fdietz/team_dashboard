// (function ($, _, Backbone, models) {
//   "use strict";

//   models.Counter = Backbone.Model.extend({

//     initialize: function(options) {
//       this.at = options.at;
//       this.targets = options.targets;
//       this.targetsArray = (this.targets || "").split(',');
//       this.source = options.source;
//       this.aggregate_function = options.aggregate_function;

//       this.isFetched = false;
//       this.bind('change', this.onChange, this);
//     },

//     onChange: function() {
//       this.isFetched = true;
//     },

//     buildTargetsParams: function() {
//       return _.map(this.targetsArray, function(target) {
//         return "targets[]="+target;
//       }).join('&');
//     },

//     url: function() {
//       var params = [this.buildTargetsParams(), 'at=' + this.at, "aggregate_function=" + this.aggregate_function, 'source=' + this.source];
//       return "/api/number?" + params.join('&');
//     }
//   });

// })($, _, Backbone, app.models);
