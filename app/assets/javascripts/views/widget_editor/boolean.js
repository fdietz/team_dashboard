(function ($, _, Backbone, views, models, collections) {
  "use strict";

  views.WidgetEditor.Boolean = Backbone.View.extend({

    initialize: function() {
    },

    render: function() {
      this.form = new Backbone.Form({
        data  : this.model.toJSON(),
        schema: this.getSchema()
      });
      this.$el.html(this.form.render().el);
      return this;
    },

    getValue: function() {
      return this.form.getValue();
    },

    getSources: function() {
      var sources = $.Sources.getBoolean();
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

    getSchema: function() {
      return {
        name:             'Text',
        update_interval:  {
          title: 'Update Interval',
          type: 'Select',
          options: this.getUpdateIntervalOptions()
        },
        source1: { title: "Source 1", type: 'Select', options: this.getSources() },
        label1: { title: "Label 1", type: 'Text' },
        source2: { title: "Source 2", type: 'Select', options: this.getSources() },
        label2: { title: "Label 2", type: 'Text' },
        source3: { title: "Source 3", type: 'Select', options: this.getSources() },
        label3: { title: "Label 3", type: 'Text' }
      };
    }

  });

})($, _, Backbone, app.views, app.models, app.collections);