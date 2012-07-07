(function ($, _, Backbone, views, models, collections) {
  "use strict";

  views.WidgetEditor.Counter = Backbone.View.extend({

    events: {
      "change #source"     : "sourceChanged"
    },

    initialize: function() {
      _.bindAll(this, "render", "prefillAutocomplete", "sourceChanged");
      collections.metrics.source = this.model.get('source');
    },

    render: function() {
      this.form = new Backbone.Form({
        data  : this.model.toJSON(),
        schema: this.getSchema()
      });
      this.$el.html(this.form.render().el);

      this.$sourceSelect = this.$('#source');
      this.$targetInput1 = this.$('#targets1');
      this.$targetInput2 = this.$('#targets2');

      this.prefillAutocomplete();

      return this;
    },

    getValue: function() {
      return this.form.getValue();
    },

    getSources: function() {
      var sources = $.Sources.getDatapoints();
      sources.unshift("");
      return sources;
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
        { val: "avg", label: 'Average' }
      ];
    },

    getSchema: function() {
      return {
        name:             'Text',
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
        source: { title: "Source", type: 'Select', options: this.getSources() },

        targets1: { title: "Targets 1", type: 'Text' },
        aggregate_function1: { title: "Aggregate Function 1", type: 'Select', options: this.getAggregateOptions() },

        targets2: { title: "Targets 2", type: 'Text' },
        aggregate_function2: { title: "Aggregate Function 2", type: 'Select', options: this.getAggregateOptions() }
      };
    },

    prefillAutocomplete: function() {
      var that = this;
      if (!collections.metrics.isFetched) {
        collections.metrics.fetch({ success: that.prefillAutocomplete });
        return;
      }
      this.$targetInput1.select2({ tags: collections.metrics.autocomplete_names() });
      this.$targetInput2.select2({ tags: collections.metrics.autocomplete_names() });
    },

    sourceChanged: function() {
      var that = this;
      this.$targetInput1.val("");
      this.$targetInput2.val("");

      collections.metrics.source = this.$sourceSelect.val();
      collections.metrics.fetch().done(function() {
        that.$targetInput.select2({ tags: collections.metrics.autocomplete_names() });
        that.$targetInput2.select2({ tags: collections.metrics.autocomplete_names() });
      });
    }

  });

})($, _, Backbone, app.views, app.models, app.collections);