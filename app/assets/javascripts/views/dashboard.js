( function (views, models, collections){

  var DashboardHeader = Backbone.View.extend({
    events: {
      "click #dashboard-name"                      : "editName",
      "submit #dashboard-name-form"                : "saveName"
    },

    initialize: function(options) {
      this.model.bind('reset', this.render, this);
    },

    render: function() {
      $(this.el).html(JST['templates/dashboards/header']({ dashboard: this.model.toJSON() }));
      return this;
    },

    editName: function() {
      this.$("#dashboard-name").toggle();
      this.$("#dashboard-name-form").toggle();

      var input = this.$("#dashboard-name-input");
      input.focus();
      return false;
    },

    saveName: function() {
      this.$("#dashboard-name").toggle();
      this.$("#dashboard-name-form").toggle();

      var input = this.$("#dashboard-name-input");
      this.$("#dashboard-name").html(input.val());
      this.model.set({name: input.val() });
      this.model.save();
      return false;
    }

  });

  var DashboardWidget = Backbone.View.extend({
    tagName: "div",
    className: "widget span6",

    events: {
      "click button.widget-delete" : "removeWidget"
    },

    initialize: function(options) {
      _.bindAll(this, "render");
      this.dashboard = options.dashboard;
      console.log("init dash", this.dashboard);
    },

    renderGraph: function(graphElement) {
      var time = "hour";
      var targets = _.map(this.model.get('metrics'), function(metric) {
        return metric.name;
      });

      var hourGraphCollection = new collections.Graph({
        targets: targets,
        time: time
      });

      hourGraphCollection.fetch({ 
        success: function(collection, response) {
          graph = new views.Graph({ series: collection.toJSON(), time: time, el: graphElement });
          graph.render();
        }
      });
    },

    render: function() {
      $(this.el).html(JST['templates/dashboards/widget']({ instrument: this.model.toJSON() }));
      this.renderGraph(this.$(".graph-container"));
      return this;
    },

    removeWidget: function(event) {
      console.log(this.$(event.target));

      var selectedWidget = this.model;
      console.log(this.model);

      var tmp = this.dashboard.get("instruments");
      console.log(tmp);
      var index = _.indexOf(tmp, this.model.id);
      console.log(index);
      tmp.splice(index, 1);
      console.log(tmp);

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

  var InstrumentsChooserDialog = Backbone.View.extend({
    events: {
      "click .btn-primary" : "addInstrument"
    },

    initialize: function(options) {
    },
  
    render: function() {
      $(this.el).html(JST['templates/dashboards/instruments_chooser']({ dashboard: this.model.toJSON() }));

      var myModal = this.$('#dashboard-details-modal');
      var that = this;
      collections.instruments.fetch({ 
        success: function(instruments, response) {
          var filtered = instruments.filter(function(instrument) {
              return !_.include(that.model.get("instruments"), instrument.get('id'));
          });

          var instrumentsSmall = new views.InstrumentsSmall({ collection: new collections.Instrument(filtered) });
          instrumentsSmall.render();
          that.$(".instruments-index-small-container").html(instrumentsSmall.el);

          myModal.modal({ keyboard: true });
        },
        error: function(model, response) {
          alert("Error request: "+response);
        }
      });

      return this;
    },

    addInstrument: function() {
      var myModal = this.$('#dashboard-details-modal');
      var tmp = this.model.get("instruments");
      var selectedCheckboxes = $("input:checked").each(function(index) {
        var id = $(this).attr("data-id")
        tmp.push(id);
      });

      myModal.modal("hide");
      this.model.set({ instruments: tmp });
      var result = this.model.save({ 
        success: function(model, request) {
          console.log("saved model: ", model);
        },
        error: function(model, request) {
          alert("failed saving model "+request);
        }
      });
      
      return false;
    }

  });

  views.Dashboard = Backbone.View.extend({
    events: {
      "click .btn.add-instrument" : "showInstrumentsChooser",
    },

    initialize: function(options) {
      _.bindAll(this, "render");
      this.model.bind('reset', this.render);
      this.model.bind('change', this.render);
    },

    renderWidgets: function() {
      var that = this;
      console.log("renderWidgets", this.model, this.model.get('instruments'));
      var targets = _.each(this.model.get('instruments'), function(id) {
        var instrument = new app.models.Instrument({ id: id});

        instrument.fetch({ 
          success: function(model, request) {
            var widget = new DashboardWidget({ model: model, dashboard: that.model });
            widget.render();
            this.$("#dashboard-widget-container").append(widget.el);
          },
          error: function(model, request) {
            alert("Error request "+request);
          }
        });
      });
    },

    render: function() {
      console.log("dashboard render");
      $(this.el).html(JST['templates/dashboards/show']({ dashboard: this.model.toJSON() }));

      header = new DashboardHeader({ model: this.model });
      header.render();
      this.$("#dashboard-detail-header").html(header.el);

      this.renderWidgets();

      return this;
    },

    showInstrumentsChooser: function() {
      console.log("showInstrumentsChooser");
      var dialog = new InstrumentsChooserDialog({ model: this.model });
      dialog.render();

      this.$("#instruments-chooser").html(dialog.el);
      return false;
    }

  });

})(app.views, app.models, app.collections);