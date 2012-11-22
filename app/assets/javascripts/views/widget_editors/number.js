(function ($, _, Backbone, views, models, collections, helpers) {
  "use strict";

  views.WidgetEditors.Number = Backbone.View.extend({

    events: {
      "change select#source1" : "sourceChanged",
      "change select#source2" : "sourceChanged",
      "change select#source3" : "sourceChanged",
      "click button.test1"    : "test1",
      "click button.test2"    : "test2",
      "click button.test3"    : "test3"
    },

    initialize: function() {
      _.bindAll(this, "sourceChanged", "render", "toggleFields", "updateFieldVisibility", "createValuePathInput", "test1", "test2", "test3", "handleTest");
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

      this.createValuePathInput(1);
      this.createValuePathInput(2);
      this.createValuePathInput(3);

      return this;
    },

    createValuePathInput: function(number) {
      var $value_path = this.$("#http_proxy-value_path"+number);
      var button = "<button class='btn test"+ number +"' type='button'><i class='icon-search icon-white'></i></button>";
      var outter = "<div class='input-append'></div>";
      $value_path.wrap(outter);
      $value_path.parent().append(button);
    },

    test1: function(event) {
      this.handleTest(1);
      return false;
    },

    test2: function(event) {
      this.handleTest(2);
      return false;
    },

    test3: function(event) {
      this.handleTest(3);
      return false;
    },

    handleTest: function(number) {
      var source = this.getSourceEl(number).val(),
          http_proxy_url = this.$("input#" + source + "-http_proxy_url" + number).val(),
          value_path = this.$("input#" + source + "-value_path" + number).val();

      this.showJSONResponseEditor(number, source, { source: source, fields: { http_proxy_url: http_proxy_url, value_path: value_path } });
    },

    showJSONResponseEditor: function(number, source, options) {
      var that = this;

      var model = new models.Number(_.extend(options, { include_response_body: true }));
      var dialog = new views.JSONResponseEditor({ model: model });
      dialog.on("inputChanged", function(newValue) {
        that.$("input#" + source + "-value_path" + number).val(newValue);
      });

      this.$el.append(dialog.render().el);
    },

    updateFieldVisibility: function(number) {
      var that   = this,
          source = this.getSourceEl(number).val();

      if (source.length === 0) {
        this.$(".field-label"+number).hide();
        _.each($.Sources.number, function(plugin) {
          that.toggleFields(plugin, number, false);
        });
      } else {
        this.$(".field-label"+number).show();
        _.each($.Sources.number, function(plugin) {
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
            callback(helpers.FormBuilder.options($.Sources.number, ops));
          },
          validators: [function requiredSource(value, formValues) {
            if (number === 1 && value.length === 0 ) { return err; }
          }]
        };

        // add extra fields as defined in source plugin
        _.each($.Sources.number, function(plugin) {
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

        result["label" + number] = { title: "Default Label " + number, type: 'Text' };
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