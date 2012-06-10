(function (views){

  views.Errors = Backbone.View.extend({
    events: {
      'click .reload': "reload"
    },

    initialize: function(options) {
      _.bindAll(this, "render");
      this.message = options.message;
    },

    reload: function() {
      window.location.reload();
    },

    render: function() {
      $(this.el).html(JST['templates/errors/show']({ message: this.message }));

      var that = this;
      this.$('#alert').bind('closed', function () {
        that.reload();
      });

      return this;
    }
  });

})(app.views);