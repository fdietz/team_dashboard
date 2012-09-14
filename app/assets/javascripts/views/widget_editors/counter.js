(function ($, _, Backbone, views, models, collections, helpers) {
  "use strict";

  views.WidgetEditors.Counter = Backbone.View.extend({

    events: {
      "change #source1"     : "sourceChanged",
      "change #source2"     : "sourceChanged"
    },

    initialize: function() {
      _.bindAll(this, "render", "sourceChanged", "showConnectionError");

      this.collection = helpers.datapointsTargetsPool.get(this.model.get('source') || $.Sources.datapoints[0]);

      this.metricsCollection1 = helpers.datapointsTargetsPool.get(this.model.get("source1"));
      this.metricsCollection2 = helpers.datapointsTargetsPool.get(this.model.get("source2"));
    },

    validate: function() {
      return this.form.validate();
    },

    render: function() {
      var flash = "<div id='modal-flash' class='alert alert-error' style='display:none;'></div>";
      this.form = new Backbone.Form({
        data  : this.model.toJSON(),
        schema: this.getSchema()
      });
      this.$el.html(flash);
      this.$el.append(this.form.render().el);

      this.$flash                    = this.$("#modal-flash");
      this.$sourceSelect1           = this.$('select#source1');
      this.$sourceSelect2           = this.$('select#source2');
      this.$targetInput1            = this.$('input#targets1');
      this.$targetInput2            = this.$('input#targets2');
      this.$targetInputField1       = this.$('.field-targets1');
      this.$aggregateFunctionField1 = this.$('.field-aggregate_function1');
      this.$targetInputField2       = this.$('.field-targets2');
      this.$aggregateFunctionField2 = this.$('.field-aggregate_function2');

      this.updateSourceFormControls(1, this.$sourceSelect1.val());
      this.updateSourceFormControls(2, this.$sourceSelect2.val());

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

    getAggregateOptions: function() {
      return [
        { val: "sum", label: 'Sum' },
        { val: "average", label: 'Average' },
        { val: "delta", label: 'Delta' }
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
            callback(helpers.FormBuilder.options($.Sources.datapoints, ops));
          },
          validators: [function requiredSource(value, formValues) {
            if (number === 1 && value.length === 0 ) { return err; }
          }]
        };
        result["targets" + number] = {
          title: "Targets " + number,
          type: 'Text',
          validators: [ function(value, formValues) {
            if (value.length === 0 && formValues["source"+number].length > 0) { return err; }
          }]
        };
        result["aggregate_function" + number] = {
          title: "Aggregate Function " + number,
          type: 'Select',
          options: that.getAggregateOptions()
        };
        return result;
      };

      var result = {
        name: { title: "Text", validators: ["required"] },
        update_interval:  {
          title: 'Update Interval',
          type: 'Select',
          options: helpers.FormDefaults.getUpdateIntervalOptions()
        },
        range: {
          title: 'Period',
          type: 'Select',
          options: helpers.FormDefaults.getPeriodOptions()
        }
      };

      result = _.extend(result, sourceFormBuilder(1));
      result = _.extend(result, sourceFormBuilder(2));

      return result;
    },

    sourceChanged: function() {
      var source   = this.$(event.target).val(),
          id       = this.$(event.target).attr("id"),
          number   = parseInt(id.charAt(id.length-1), 10);

      this.updateSourceFormControls(number, source);
    },

    updateSourceFormControls: function(number, source) {
      var targetInputField       = this["$targetInputField" + number],
          aggregateFunctionField = this["$aggregateFunctionField" + number],
          targetInput            = this["$targetInput" + number],
          metrics                = this["metricsCollection" + number];

      if (source.length === 0) {
        targetInputField.hide();
        aggregateFunctionField.hide();
      } else {
        targetInputField.show();
        aggregateFunctionField.show();

        if (metrics.source !== source) {
          targetInput.val("");
        }

        if ($.Sources.datapoints[source].supports_target_browsing === true) {
          this.updateAutocompleteTargets(number);
        } else {
          targetInput.selectable("disable");
        }
      }
    },

    updateAutocompleteTargets: function(number) {
      var metrics = this["metricsCollection" + number],
          source  = this["$sourceSelect" + number].val(),
          options = { suppressErrors: true },
          that    = this;
      metrics = helpers.datapointsTargetsPool.get(source);
      this["$targetInput" + number].selectable("disable");
      this.initTargetSelectable(number, metrics);
    },

    initTargetSelectable: function(number, collection) {
      var that = this;
      var options = {
        browseCallback :  function(event) {
          var browser = new views.TargetBrowser({ collection: collection });

          browser.on("selectionChanged", function(selection) {
            var $input         = that["$targetInput" + number],
                currentTargets = $input.val(),
                source         = that["$sourceSelect" + number].val();
            $input.selectable("disable");
            $input.val(currentTargets + ";" + selection);
            that.initTargetSelectable(number, helpers.datapointsTargetsPool.get(source));
          });

          that.$el.append(browser.render().el);
        }
      };

      if ($.Sources.datapoints[that["$sourceSelect" + number].val()].supports_functions === true) {
        _.extend(options, {
          editCallback: function(target, event) {
            var dialog = new views.FunctionEditor({ target: target, collection: collection });

            dialog.on("inputChanged", function(newValue) {
              var $input = that["$targetInput" + number];
              $input.selectable("update", target, newValue);
            });

            that.$el.append(dialog.render().el);
          }
        });
      }

      this["$targetInput" + number].selectable(options);
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