(function (views){

  views.About = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "render");
    },

    render: function() {
      console.log(this.response);
      $(this.el).html(JST['templates/abouts/show']());
      return this;
    }
  });

})(app.views);