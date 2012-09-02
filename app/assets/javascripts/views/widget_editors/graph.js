(function ($, _, Backbone, views, models, collections, helpers) {
  "use strict";

  views.WidgetEditors.Graph = Backbone.View.extend({

    events: {
      "change #source"     : "sourceChanged"
    },

    initialize: function() {
      _.bindAll(this, "render", "sourceChanged", "showConnectionError", "showBrowseDialog");

      this.collection = helpers.datapointsTargetsPool.get(this.model.get('source') || $.Sources.datapoints[0]);
    },

    render: function() {
      var flash = "<div id='modal-flash' class='alert alert-error' style='display:none;'></div>";
      this.form = new Backbone.Form({
        data  : this.model.toJSON(),
        schema: this.getSchema()
      });
      this.$el.html(flash);
      this.$el.append(this.form.render().el);

      this.$flash             = this.$("#modal-flash");
      this.$targetInput       = this.$('input#targets');
      this.$targetInputField  = this.$('.field-targets');
      this.$sourceSelect      = this.$('select#source');

      this.updateSourceFormControls(this.$sourceSelect.val());

      return this;
    },

    validate: function() {
      return this.form.validate();
    },

    getValue: function() {
      return this.form.getValue();
    },

    getUpdateIntervalOptions: function() {
      return [
        { val: 10, label: '10 sec' },
        { val: 600, label: '1 min' },
        { val: 6000, label: '10 min' },
        { val: 36000, label: '1 hour' }
      ];
    },

    getPeriodOptions: function() {
      return [
        { val: "30-minutes", label: "Last 30 minutes" },
        { val: "60-minutes", label: "Last 60 minutes" },
        { val: "3-hours", label: "Last 3 hours" },
        { val: "12-hours", label: "Last 12 hours" },
        { val: "24-hours", label: "Last 24 hours" },
        { val: "3-days", label: "Last 3 days" },
        { val: "7-days", label: "Last 7 days" },
        { val: "4-weeks", label: "Last 4 weeks" }
      ];
    },

    getAggregateOptions: function() {
      return [
        { val: "sum", label: 'Sum' },
        { val: "average", label: 'Average' },
        { val: "delta", label: 'Delta' }
      ];
    },

    getSizeOptions: function() {
      return [
        { val: 1, label: '1 Column' },
        { val: 2, label: '2 Columns' },
        { val: 3, label: '3 Columns' }
      ];
    },

    getGraphTypeOptions: function() {
      return [
        { val: 'line', label: 'Line Graph' },
        { val: 'stack', label: 'Stacked Graph' }
      ];
    },

    getSchema: function() {
      var err = { type: 'required', message: 'Required' };
      return {
        name: { title: "Text", validators: ["required"] },
        update_interval:  {
          title: 'Update Interval',
          type: 'Select',
          options: this.getUpdateIntervalOptions()
        },
        range: {
          title: 'Period',
          type: 'Select',
          options: this.getPeriodOptions()
        },
        size: { title: "Size", type: 'Select', options: this.getSizeOptions() },
        graph_type: { title: "Graph Type", type: "Select", options: this.getGraphTypeOptions() },
        source: {
          title: "Source",
          type: 'Select',
          options: function(callback) {
            callback(helpers.FormBuilder.options($.Sources.datapoints));
          },
          validators: ["required"]
        },
        targets: { title: "Targets", type: 'Text', validators: [ function checkTargets(value, formValues) {
            if (value.length === 0) { return err; }
          }
        ]}
      };
    },

    sourceChanged: function(event) {
      var source  = this.$sourceSelect.val();
      this.updateSourceFormControls(source);
    },

    updateSourceFormControls: function(source) {
      var options = { suppressErrors: true },
          that    = this;

      if (source.length === 0) {
      } else {
        if (this.collection.source !== source) {
          this.$targetInput.val("");
        }

        if ( $.Sources.datapoints[source].supports_target_browsing === true) {
          this.collection = helpers.datapointsTargetsPool.get(source);
          that.$targetInput.selectable("disable");
          if (this.collection.populated === true) {
            this.initTargetSelectable();
          } else {
            this.collection.fetch()
            .done(function() {
              that.initTargetSelectable();
            })
            .error(this.showConnectionError);
          }
        } else {
          that.$targetInput.selectable("disable");
        }
      }
    },

    initTargetSelectable: function() {
      this.$targetInput.selectable({
        source:           this.collection.autocomplete_names(),
        browseCallback :  this.showBrowseDialog
      });
    },

    showBrowseDialog: function(event) {
      var that = this,
          browser = new views.TargetBrowser({ targets: this.collection.toJSON() });
      browser.on("selectionChanged", function(selection) {
        var currentTargets = that.$targetInput.val();
        that.$targetInput.selectable("disable");
        that.$targetInput.val(currentTargets + "," + selection);
        that.initTargetSelectable();
      });
      this.$el.append(browser.render().el);
    },

    showConnectionError: function() {
      var that    = this,
          message = JSON.parse(arguments[0].responseText).message;

      this.$flash.html("<p>Error while retrieving available targets: " + message + "</p>");
      this.$flash.slideDown();
      window.setTimeout(function() { that.$flash.fadeOut(); }, 10000);
    }

  });

})($, _, Backbone, app.views, app.models, app.collections, app.helpers);