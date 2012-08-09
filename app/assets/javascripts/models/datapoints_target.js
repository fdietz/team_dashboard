(function ($, _, Backbone, models) {
  "use strict";

  models.DatapointsTarget = Backbone.Model.extend({
    urlRoot: '/api/datapoints_targets'
  });

})($, _, Backbone, app.models);
