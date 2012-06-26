(function ($, _, Backbone, models) {
  "use strict";

  models.Widget = Backbone.Model.extend({
    defaults: {
      "name"        : "Undefined name",
      "range"       : '30-minutes',
      "source1"     : '',
      "source2"     : '',
      "source3"     : '',
      "label1"      : '',
      "label2"      : '',
      "label3"      : '',
      "aggregate_function1" : 'sum',
      "aggregate_function2" : 'sum',
      "targets1"      : '',
      "targets2"      : '',
      "update_interval": '10'
    },

    url: function() {
      var tmp = "/api/dashboards/" + this.get("dashboard_id") + "/widgets";

      if (this.isNew()) {
        return tmp;
      } else {
        return tmp + "/" + this.get("id");
      }
    },

    targetsString: function() {
      return (this.get("targets") || "").split(',');
    }

  });

})($, _, Backbone, app.models);
