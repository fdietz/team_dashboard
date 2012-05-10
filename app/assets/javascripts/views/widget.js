(function (views, models, collections) {

  var EditWidgetDialog = Backbone.View.extend({

    events: {
      "click #widget-details-modal .btn-primary" : "saveChanges",
    },

    initialize: function(options) {
      _.bindAll(this, "render");
    },
    
    render: function() {
      $(this.el).html(JST['templates/widgets/edit']({ dashboard: this.model.toJSON() }));

      var myModal = this.$('#widget-details-modal');
      console.log(myModal);
      //myModal.on("shown", function() { input.focus(); });
      myModal.modal({ keyboard: true });

      return this;
    },

    saveChanges: function() {
      var myModal = this.$('#widget-details-modal');
      
      return false;
    }

  });

  views.Widget = Backbone.View.extend({
    tagName: "div",
    className: "widget span6",

    events: {
      "click button.widget-delete" : "removeWidget",
      "click button.widget-edit" : "editWidget"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "updateWidget", "renderGraph");

      this.dashboard = options.dashboard;
      this.time = "hour";
      this.targets = _.map(this.model.get('metrics'), function(metric) {
        return metric.name;
      });
      this.collection = new collections.Graph({
        targets: this.targets,
        time: this.time
      });
      this.collection.bind('change', this.render);

      this.updateWidget();
    },

    updateWidget: function() {
      this.collection.fetch({
        success: _.bind(function(model, response) {
          this.renderGraph();
          this.graph.update();  

          setTimeout(this.updateWidget, 5000);
        }, this), 
        error: _.bind(function(model, response) {
          console.log("error updating widget", response);
        }, this)
      });
    },

    editWidget: function() {
      console.log("editWidget", this.model.id);

      var dialog = new EditWidgetDialog({ model: this.model });
      dialog.render();

      this.$("#widget-edit-dialog").html(dialog.el);
      return false;

    },

    renderGraph: function() {
      var hasData = _.any(this.collection.toJSON(), function(series) {
        return series.data.length > 0;
      });

      if (hasData) {
        var metrics = this.model.get('metrics');
        this.graph = new views.Graph({ metrics: metrics, series: this.collection.toJSON(), time: this.time, renderer: this.model.get("renderer"), el: this.$(".graph-container") });
        this.graph.render();
        this.graph.update();
      } else {
        console.log("no graph data available");
        this.$(".graph-container").html("<p>No Graph data available in this time frame</p>");
      }  
    },

    render: function() {
      console.log("render widget", this.collection, this.collection.toJSON());
      $(this.el).html(JST['templates/widgets/show']({ instrument: this.model.toJSON() }));

      var metrics = this.model.get('metrics');
      this.graph = new views.Graph({ metrics: metrics, series: this.collection.toJSON(), time: this.time, el: this.$(".graph-container") });

      return this;
    },

    removeWidget: function(event) {
      var tmp = this.dashboard.get("instruments");
      tmp.splice(_.indexOf(tmp, this.model.id), 1);

      this.dashboard.set({ instruments: tmp });
      var result = this.dashboard.save({ 
        success: function(model, request) {
          console.log("saved model: ", model);
        },
        error: function(model, request) {
          alert("failed saving model "+request);
        }
      });

      this.remove();
      this.unbind();
    }

  });

})(app.views, app.models, app.collections);