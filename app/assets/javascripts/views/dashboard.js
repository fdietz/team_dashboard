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

    initialize: function() {
      _.bindAll(this, "render");
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

      hourGraphCollection.fetch({ success: function(collection, response) {
        graph = new views.Graph({ series: collection.toJSON(), time: time, el: graphElement });
        graph.render();
      }});
    },

    render: function() {
      $(this.el).html(JST['templates/dashboards/widget']({ instrument: this.model.toJSON() }));

      this.renderGraph(this.$(".graph-container"));

      return this;
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
      var instrumentNames = this.instrumentNames();

      collections.instruments.fetch({ 
        success: function(instruments, response) {
          var filtered = instruments.filter(function(instrument) {
              return !_.include(instrumentNames, instrument.get('name'));
          });

          var instrumentsSmall = new views.InstrumentsSmall({ collection: new collections.Instrument(filtered) });
          instrumentsSmall.render();
          this.$(".instruments-index-small-container").html(instrumentsSmall.el);

          myModal.modal({ keyboard: true });
        },
        error: function(model, response) {
          alert("Error request: "+response);
        }
      });

      return this;
    },

    instrumentNames: function() {
      return _.map(this.model.get("instruments"), function(instrument) {
        return instrument.name;
      });
    },

    addInstrument: function() {
      var myModal = this.$('#dashboard-details-modal');
      var tmp = this.model.get("instruments");

      collections.instruments.each(function(instrument) {
        var checkbox = this.$("input[data-id=" + instrument.id +"]");
        var checked = checkbox.attr("checked");
        if (checked) {
          tmp.push({ name: instrument.get("name") });
        }
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
      
      // TODO: remove explicit rendering
      //this.render();
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
      console.log("renderWidgets", this.model.get('instruments'));
      var targets = _.each(this.model.get('instruments'), function(instr) {
        var name = instr.name;
        app.collections.instruments.fetch({ success: function(model, request) {
          var instrument = collections.instruments.find(function(i) {
            return i.get('name') === name;
          });
          console.log("appending instrument widget", instrument.get("name"), instrument)
          var widget = new DashboardWidget({ model: instrument });
          widget.render();
          this.$("#dashboard-widget-container").append(widget.el);
        }});
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
    }

  });

})(app.views, app.models, app.collections);