(function ($, _, Backbone, views, models, collections, helpers) {
  "use strict";

  views.WidgetEditors.Ci = Backbone.View.extend({

    events: {
      "change select#source1" : "sourceChanged",
      "change select#source2" : "sourceChanged",
      "change select#source3" : "sourceChanged"
    },

    initialize: function() {
      _.bindAll(this, "render", "sourceChanged");
    },

    validate: function() {
      return this.form.validate();
    },

    sourceChanged: function(event) {
      var value  = this.$(event.target).val(),
          id     = this.$(event.target).attr("id"),
          number = id.charAt(id.length-1),
          el1     = this.$(".field-server_url"+number),
          el2     = this.$(".field-project"+number);
      if (value === "") {
        el1.slideUp();
        el2.slideUp();
      } else {
        el1.slideDown();
        el2.slideDown();
      }
    },

    render: function() {
      this.form = new Backbone.Form({
        data  : this.model.toJSON(),
        schema: this.getSchema()
      });
      this.$el.html(this.form.render().el);

      this.updateOptionalFieldVisibility(1);
      this.updateOptionalFieldVisibility(2);
      this.updateOptionalFieldVisibility(3);

      return this;
    },

    updateOptionalFieldVisibility: function(number) {
      if (this.getSourceEl(number).val() === "") {
        this.getServerUrlFieldEl(number).hide();
        this.getProjectFieldEl(number).hide();
      } else {
        this.getServerUrlFieldEl(number).show();
        this.getProjectFieldEl(number).show();
      }
    },

    getServerUrlFieldEl: function(number) {
      return this.$(".field-server_url"+number);
    },

    getProjectFieldEl: function(number) {
      return this.$(".field-project"+number);
    },

    getSourceEl: function(number) {
      return this.$("select#source"+number);
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
            callback(helpers.FormBuilder.options($.Sources.ci, ops));
          },
          validators: [function requiredSource(value, formValues) {
            if (number === 1 && value.length === 0 ) { return err; }
          }]
        };
        result["server_url" + number] = {
          title: "Server URL " + number,
          type: "Text",
          validators: [ function checkServerUrl(value, formValues) {
            if ((formValues["source" + number] === "jenkins" || formValues["source" + number] === "travis") && value.length === 0) { return err; }
          }]
        };
        result["project" + number] = {
          title: "Project " + number,
          type: "Text",
          validators: [ function checkServerUrl(value, formValues) {
            if ((formValues["source" + number] === "jenkins" || formValues["source" + number] === "travis") && value.length === 0) { return err; }
          }]
        };
        return result;
      };

      var result = {
        name: { title: "Text", validators: ["required"] },
        update_interval:  {
          title: 'Update Interval',
          type: 'Select',
          options: this.getUpdateIntervalOptions()
        }
      };

      result = _.extend(result, sourceFormBuilder(1));
      result = _.extend(result, sourceFormBuilder(2));
      result = _.extend(result, sourceFormBuilder(3));
      return result;
    }

  });

})($, _, Backbone, app.views, app.models, app.collections, app.helpers);