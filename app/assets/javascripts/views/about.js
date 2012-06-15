(function ($, _, Backbone, views){
  "use strict";

  views.About = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "render");
    },

    render: function() {
      $(this.el).html(JST['templates/abouts/show']());
      return this;
    }
  });

})($, _, Backbone, app.views);
