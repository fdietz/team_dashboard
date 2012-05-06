(function (views){

  views.Metrics = Backbone.View.extend({
    render: function() {
      $(this.el).html("This is a metrics list view");
      return this;
    }
  });

})(app.views);