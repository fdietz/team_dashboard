(function (views, collections, router){

  var InstrumentTable = Backbone.View.extend({
    events: {},

    initialize: function(options) {
      this.model.bind('reset', this.render, this);
      this.model.bind('change:metrics', this.render, this);
    },

    render: function() {
      $(this.el).html(JST['templates/instruments/table']({ instrument: this.model.toJSON() }));
      return this;
    }
  });

  var InstrumentHeader = Backbone.View.extend({
    events: {
      "click h1[data-inline-edit]"         : "editName",
      "submit form[data-inline-edit]"      : "saveName",
      "keyup form[data-inline-edit]>input" : "cancelEdit"
    },

    initialize: function(options) {
      this.model.bind('reset', this.render, this);
      this.model.bind('change:metrics', this.render, this);
    },

    render: function() {
      $(this.el).html(JST['templates/instruments/header']({ instrument: this.model.toJSON() }));
      this.h1 = this.$("h1[data-inline-edit]");
      this.form = this.$("form[data-inline-edit]");
      this.input = this.$("form[data-inline-edit]>input");
      
      return this;
    },

    editName: function() {
      this.h1.toggle();
      this.form.toggle();
      this.input.focus();
      return false;
    },

    saveName: function() {
      this.h1.toggle();
      this.form.toggle();

      this.h1.html(this.input.val());
      this.model.set({name: this.input.val() });
      this.model.save();
      return false;
    },

    cancelEdit: function(event) {
      if (event.keyCode == 27) {
        this.h1.toggle();
        this.form.toggle();      
      }
    }

  });

  views.Instrument = Backbone.View.extend({

    events: {
      "click .btn.add-metric"                        : "addMetricDialog",
      "submit #modal-search-form"                    : "addMetric",
      "click #instrument-details-modal .btn-primary" : "addMetric",
      "click button.instrument-delete"               : "removeInstrument"
    },

    initialize: function(options) {
      this.model.bind('reset', this.render, this);
      this.model.bind('change:metrics', this.render, this);
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
        success: function(collection, resopnse) {
          console.log("raw", hourGraphCollection, hourGraphCollection.models);

          graph = new views.Graph({ series: collection.toJSON(), time: time, el: graphElement });
          graph.render();
        }
      });
    },

    render: function() {
      $(this.el).html(JST['templates/instruments/show']({ instrument: this.model.toJSON() }));

      table = new InstrumentTable({ model: this.model });
      table.render();
      this.$("#instrument-table-container").append(table.el);

      header = new InstrumentHeader({ model: this.model });
      header.render();
      this.$("#instrument-detail-header").append(header.el);

      this.renderGraph(this.$("#instrument-graph-container"));

      return this;
    },

    addMetricDialog: function() {
      var input = this.$('#instrument-details-search-target');
      var myModal = this.$('#instrument-details-modal');
      var existingNames = this.model.get("metrics").map(function(metric) {
        return metric.name;
      });

      myModal.on("shown", function() { input.focus(); });

      collections.metrics.fetch({ success: function(metrics, response) {
        var filteredItems = _.filter(metrics.toJSON(), function(metric) {
          return !_.include(existingNames, metric.name);
        });

        var items = _.map(filteredItems, function(metric) {
          return metric.name;
        });
        
        input.typeahead({ source: items, items: 5 });
        myModal.modal({ keyboard: true });
      }});
    },

    addMetric: function() {
      var myModal = this.$('#instrument-details-modal');
      var input = this.$('#instrument-details-search-target');

      var metricName = input.val();
      myModal.modal("hide");
      console.log("metricName", metricName);

      var tmp = this.model.get("metrics");
      tmp.push({ name: metricName });
      this.model.set({ metrics: tmp});
      this.model.save();
      // TODO: remove explicit rendering
      this.render();
      console.log(this.model);
      return false;
    },

    removeInstrument: function() {
      console.log("removeInstrument", router);

      var result = this.model.destroy({ 
        success: function(model, request) {
          console.log("destroyed model: ", model);
          window.app.router.navigate("/instruments", { trigger: true })
        },
        error: function(model, request) {
          alert("failed destroying model "+request);
        }
      });
    }
  });

})(app.views, app.collections, app.router);