(function ($, _, Backbone, models) {
  "use strict";

  models.Metric = Backbone.Model.extend({
    urlRoot: '/api/metrics'
  });

})($, _, Backbone, app.models);
