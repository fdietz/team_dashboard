(function (views){

  views.Errors = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, "render");
      this.response = options.response;
    },

    render: function() {
      console.log(this.response);
      $(this.el).html(JST['templates/errors/show']({ response: this.response}));
      return this;
    }
  });

})(app.views);