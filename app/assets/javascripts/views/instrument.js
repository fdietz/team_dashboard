(function (views, collections){

  var InstrumentTable = Backbone.View.extend({
    // template: Handlebars.compile($("#instrument-details-table").html()),

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

  var InstrumentSidebar = Backbone.View.extend({
    // template: Handlebars.compile($("#instrument-details-sidebar").html()),

    events: {},

    initialize: function(options) {
      this.model.bind('reset', this.render, this);
      this.model.bind('change:metrics', this.render, this);
    },

    render: function() {
      $(this.el).html(JST['templates/instruments/sidebar']({ instrument: this.model.toJSON() }));
      return this;
    }
  });

  var InstrumentHeader = Backbone.View.extend({
    // template: Handlebars.compile($("#instrument-details-header").html()),
    events: {
      "click #instrument-name"                      : "editName",
      "submit #instrument-name-form"                : "saveName"
    },

    initialize: function(options) {
      this.model.bind('reset', this.render, this);
      this.model.bind('change:metrics', this.render, this);
    },

    render: function() {
      $(this.el).html(JST['templates/instruments/header']({ instrument: this.model.toJSON() }));
      return this;
    },

    editName: function() {
      this.$("#instrument-name").toggle();
      this.$("#instrument-name-form").toggle();

      var input = this.$("#instrument-name-input");
      input.focus();
      return false;
    },

    saveName: function() {
      this.$("#instrument-name").toggle();
      this.$("#instrument-name-form").toggle();

      var input = this.$("#instrument-name-input");
      this.$("#instrument-name").html(input.val());
      this.model.set({name: input.val() });
      this.model.save();
      return false;
    }

  });

  views.Instrument = Backbone.View.extend({
    // template: Handlebars.compile($("#instrument-details").html()),

    events: {
      "click .btn.add-metric"                       : "addMetricDialog",
      "click .btn.save"                             : "save",
      "submit #modal-search-form"                   : "addMetric",
      "click #instrument-details-modal .btn-primary": "addMetric"
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

      hourGraphCollection.fetch({ success: function(collection, resopnse) {
        console.log("raw", hourGraphCollection, hourGraphCollection.models);

        graph = new views.Graph({ series: collection.toJSON(), time: time, el: graphElement });
        graph.render();
      }});
    },

    render: function() {
      $(this.el).html(JST['templates/instruments/show']({ instrument: this.model.toJSON() }));

      table = new InstrumentTable({ model: this.model });
      table.render();
      this.$("#instrument-table-container").append(table.el);

      sidebar = new InstrumentSidebar( { model: this.model });
      sidebar.render();
      this.$("#instrument-sidebar-container").append(sidebar.el);

      header = new InstrumentHeader({ model: this.model });
      header.render();
      this.$("#instrument-detail-header").append(header.el);

      this.renderGraph(this.$("#instrument-graph-container"));

      return this;
    },

    addMetricDialog: function() {
      var input = this.$('#instrument-details-search-target');
      var myModal = this.$('#instrument-details-modal');

      myModal.on("shown", function() { input.focus(); });

      collections.metrics.fetch({ success: function(metrics, response) {
        var items = _.map(metrics.toJSON(), function(metric) {
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

    save: function() {
      console.log("save");
      this.model.save();
    }
  });

})(app.views, app.collections);