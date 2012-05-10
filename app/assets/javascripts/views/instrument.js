(function (views, collections, router){

  var InstrumentTable = Backbone.View.extend({
    events: {
      "click button.remove-metric" : "removeMetric",
      "change select.color"        : "colorChanged"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "removeMetric");
      this.model.bind('change:metrics', this.render, this);
    },

    render: function() {
      $(this.el).html(JST['templates/instruments/table']({ instrument: this.model.toJSON() }));

      var that = this;
      this.$('.color').colorpicker().on('changeColor', function(event) {
        var metricName = $(event.currentTarget).attr("data-metric-name");
        var color = event.color.toHex();
        $(event.currentTarget).css("background-color", color);
      });
      
      this.$('.color').colorpicker().on("show", function(event) {
        console.log("show");
      });

      this.$('.color').colorpicker().on("hide", function(event) {
        var metricName = $(event.currentTarget).attr("data-metric-name");
        var color = event.color.toHex();
        $(event.currentTarget).css("background-color", color);
        that.colorChanged(metricName, color);
      });

      return this;
    },

    removeMetric: function(event) {
      var selectedName = this.$(event.currentTarget).attr("data-metric-name");
      var tmp = this.model.get("metrics");
      var filtered = _.filter(tmp, function(metric) {
        return selectedName !== metric.name
      });
      this.model.save({ metrics: filtered }, {
        success: function(model, response) {
          console.log("model saved", model);
        },
        error: function(model, response) {
          console.log("model save failed", response);
          alert("save failed "+response);
        }
      });      
    },

    colorChanged: function(metricName, color) {
      console.log(metricName, color);

      var tmp = this.model.get("metrics");
      _.each(tmp, function(metric) {
        console.log(metricName, metric.name);
        if (metricName === metric.name) {
          metric.color = color;
        }
      });

      console.log(tmp);
      this.model.set({ metrics: tmp });
      this.model.save({
        success: function(model, response) {
          console.log("model saved", model);
        },
        error: function(model, response) {
          console.log("model save failed", response);
          alert("save failed "+response);
        }
      });

    }
  });

  var MetricsChooserDialog = Backbone.View.extend({
    events: {
      "submit #modal-search-form"                    : "addMetric",
      "click #instrument-details-modal .btn-primary" : "addMetric",
    },

    initialize: function(options) {
      _.bindAll(this, "render", "addMetric");
    },
    
    render: function() {
      $(this.el).html(JST['templates/instruments/metrics_chooser']({ dashboard: this.model.toJSON() }));

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
        console.log("items", items);
        input.typeahead({ source: items, items: 5 });
        myModal.modal({ keyboard: true });
      }});

      return this;
    },

    addMetric: function() {
      var myModal = this.$('#instrument-details-modal');
      var input = this.$('#instrument-details-search-target');

      var metricName = input.val();
      myModal.modal("hide");
      console.log("metricName", metricName);

      var tmp = this.model.get("metrics");
      tmp.push({ name: metricName });
      console.log("tmp", tmp);
      this.model.set({ metrics: tmp });
      this.model.save({
        success: function(model, response) {
          console.log("model saved", model);
        },
        error: function(model, response) {
          console.log("model save failed", response);
          alert("save failed "+response);
        }
      });
      
      return false;
    }

  });

  views.Instrument = Backbone.View.extend({

    events: {
      "click .btn.add-metric"              : "showMetricsChooser",
      "click button.instrument-delete"     : "removeInstrument",
      "click .time"                        : "switchTime",
      "click span[data-inline-edit]"        : "editName",
      "submit form[data-inline-edit]"      : "saveName",
      "keyup form[data-inline-edit]>input" : "cancelEdit"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "editName", "saveName", "cancelEdit");
      this.model.bind('change', this.render, this);
      this.time = "hour";
    },

    renderGraph: function(graphElement) {
      var time = "hour";

      var targets = _.map(this.model.get('metrics'), function(metric) {
        return metric.name;
      });

      var hourGraphCollection = new collections.Graph({
        targets: targets,
        time: this.time
      });

      // var that = this;
      var metrics = this.model.get("metrics");
      hourGraphCollection.fetch({ 
        success: function(collection, response) {
          var hasData = _.any(collection.toJSON(), function(item) {
            return item.data.length > 0;
          });
          if (hasData) {
            var series = collection.toJSON();

            // _.each(metrics, function(metric, index) {
            //   if (metric.name == series[index].name) {
            //     series[index].color = metric.color
            //   }
            // });

            // _.each(series, function(data) {
            //   if (data.color === undefined) {
            //     data.color = '#00A388';
            //   }
            // });

            graph = new views.Graph({ series: series, metrics: metrics, time: this.time, el: graphElement });
            graph.render();  
          } else {
            console.log("no graph data available");
            graphElement.html("<p>No Graph data available in this time frame</p>");
          }
          
        }
      });
    },

    render: function() {
      console.log("instrument render");
      $(this.el).html(JST['templates/instruments/show']({ instrument: this.model.toJSON() }));

      this.heading = this.$("span[data-inline-edit]");
      this.form = this.$("form[data-inline-edit]");
      this.input = this.$("form[data-inline-edit]>input");

      table = new InstrumentTable({ model: this.model });
      table.render();
      this.$("#instrument-table-container").append(table.el);

      this.renderGraph(this.$("#instrument-graph-container"));

      var button = this.$("button[data-time='"+this.time+ "']");
      button.addClass("active");

      return this;
    },

    showMetricsChooser: function() {
      console.log("showMetricsChooser");
      var dialog = new MetricsChooserDialog({ model: this.model });
      dialog.render();

      this.$("#metrics-chooser").html(dialog.el);
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
    },

    switchTime: function(event) {
      var button = this.$(event.target);
      this.time = button.attr("data-time");
      this.render();
    },

    editName: function() {
      console.log("editName");
      this.heading.toggle();
      this.form.css("display", "inline");
      this.input.focus();
      return false;
    },

    saveName: function() {
      this.heading.toggle();
      this.form.toggle();

      this.heading.html(this.input.val());
      this.model.set({name: this.input.val() });
      this.model.save();
      return false;
    },

    cancelEdit: function(event) {
      if (event.keyCode == 27) {
        this.heading.toggle();
        this.form.toggle();      
      }
    }

  });

})(app.views, app.collections, app.router);