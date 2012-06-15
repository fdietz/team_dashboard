(function ($, _, Backbone, models) {
  "use strict";

  models.Widget = Backbone.Model.extend({
    defaults: {
      "name"        : "Undefined name"
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

    // toJSON: function() {
    //   return { widget: _.clone(this.attributes) }
    // }

  });

})($, _, Backbone, app.models);
