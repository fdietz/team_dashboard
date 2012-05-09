(function (views, router){

  views.Dashboards = Backbone.View.extend({

    events: {
      "click .dashboard-create": "createDashboard"
    },

    initialize: function(options) {
      _.bindAll(this, "render");
    },

    render: function() {
      $(this.el).html(JST['templates/dashboards/index']({ dashboards: this.collection.toJSON() }));
      return this;
    },

    createDashboard: function() {
      console.log("createDashboard");
      var model = new app.models.Dashboard();
      model.save({}, {
        success: function(model, request) {
          console.log("model", model);
          window.app.router.navigate("/dashboards/" + model.id, { trigger: true });
        },
        error: function(model, request) {
          alert(request);
        }
      });
    }
    
  });

})(app.views, app.router);