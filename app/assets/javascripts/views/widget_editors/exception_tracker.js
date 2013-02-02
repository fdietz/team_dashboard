(function ($, _, Backbone, views, models, collections, helpers) {
  "use strict";

  views.WidgetEditors.ExceptionTracker = Backbone.View.extend({

    events: {
      "change select#source1" : "sourceChanged",
      "change select#source2" : "sourceChanged",
      "change select#source3" : "sourceChanged"
    },

    initialize: function() {
      _.bindAll(this, "render", "sourceChanged", "updateFieldVisibility", "toggleFields");
    },

    validate: function() {
      return this.form.validate();
    },

    sourceChanged: function(event) {
      var value  = this.$(event.target).val(),
          id     = this.$(event.target).attr("id"),
          number = id.charAt(id.length-1);

      this.updateFieldVisibility(number);
    },

    render: function() {
      this.form = new Backbone.Form({
        data  : this.model.toJSON(),
        schema: this.getSchema()
      });
      this.$el.html(this.form.render().el);

      this.updateFieldVisibility(1);
      this.updateFieldVisibility(2);
      this.updateFieldVisibility(3);

      return this;
    },

    updateFieldVisibility: function(number) {
      var that   = this,
          source = this.getSourceEl(number).val();

      if (source.length === 0) {
        _.each($.Sources.exception_tracker, function(plugin) {
          that.toggleFields(plugin, number, false);
        });
      } else {
        _.each($.Sources.exception_tracker, function(plugin) {
          that.toggleFields(plugin, number, plugin.name === source);
        });
      }
    },

    toggleFields: function(plugin, number, show) {
      var that = this;
      _.each(plugin.fields, function(field) {
        var el = that.$(".field-"+ plugin.name + "-" + field.name + number);
        if (show === true) {
          el.show();
        } else {
          el.hide();
        }
      });
    },

    getSourceEl: function(number) {
      return this.$("select#source"+number);
    },

    getValue: function() {
      return this.form.getValue();
    },

    getSchema: function() {
      var that = this;
      var err = { type: 'required', message: 'Required' };

      var sourceFormBuilder = function(number) {
        var result = {};
        result["source" + number] = {
          title: "Source " + number,
          type: 'Select',
          options: function(callback) {
            var ops = { emptyOption: number > 1 };
            callback(helpers.FormBuilder.options($.Sources.exception_tracker, ops));
          },
          validators: [function requiredSource(value, formValues) {
            if (number === 1 && value.length === 0 ) { return err; }
          }]
        };

        // add extra fields as defined in source plugin
        _.each($.Sources.exception_tracker, function(plugin) {
          _.each(plugin.fields, function(field) {
            result[plugin.name + "-" + field.name + number] = {
              title: field.title + " " + number,
              type: "Text"
            };
            if (field.mandatory === true) {
              result[plugin.name + "-" + field.name + number].validators = [ function check(value, formValues) {
                if (formValues["source" + number] === plugin.name && value.length === 0) { return err; }
              }];
            }
          });
        });
        return result;
      };

      var result = {
        name: { title: "Text", validators: ["required"] },
        update_interval:  {
          title: 'Update Interval',
          type: 'Select',
          options: helpers.FormDefaults.getUpdateIntervalOptions()
        }
      };

      result = _.extend(result, sourceFormBuilder(1));
      result = _.extend(result, sourceFormBuilder(2));
      result = _.extend(result, sourceFormBuilder(3));
      return result;
    }

  });

})($, _, Backbone, app.views, app.models, app.collections, app.helpers);