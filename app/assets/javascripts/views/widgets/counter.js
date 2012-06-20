(function ($, _, Backbone, views, models, collections){
  "use strict";

  views.widgets.Counter = Backbone.View.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "update", "widgetChanged", "updateValues");

      this.range = '30-minutes';

      this.updateCounterModel();
      this.updateSecondaryCounterModel();

      this.model.on('change', this.widgetChanged);
    },

    updateCounterModel: function() {
      this.counterModel = new models.Counter({
        targets: this.model.get('targets'),
        source: this.model.get('source'),
        aggregate_function: 'sum',
        at: $.TimeSelector.getCurrent()
      });
    },

    updateSecondaryCounterModel: function() {
      this.secondaryCounterModel = new models.Counter({
        targets: this.model.get('targets'),
        source: this.model.get('source'),
        aggregate_function: 'sum',
        at: $.TimeSelector.getFrom(this.range)
      });
    },

    widgetChanged: function() {
      this.updateCounterModel();
      this.updateSecondaryCounterModel();
      this.render();
    },

    value: function() {
      return this.counterModel.get('value') || 0;
    },

    secondaryValue: function() {
      var y1 = this.counterModel.get('value') || 0;
      var y2 = this.secondaryCounterModel.get('value') || 0;
      if (y1 && y2) {
        var result = ((y1 - y2) / y2) * 100;
        return result.toFixed(2);
      } else {
        return 0;
      }
    },

    updateSecondaryValueClass: function(secondaryValue) {
      if (this.secondaryValue > 0) {
        this.$arrow.removeClass('arrow-down');
        this.$arrow.addClass('arrow-up');
        this.$secondaryValue.addClass('secondary-value-up');
        this.$secondaryValue.removeClass('secondary-value-down');
      } else {
        this.$arrow.addClass('arrow-down');
        this.$arrow.removeClass('arrow-up');
        this.$secondaryValue.addClass('secondary-value-down');
        this.$secondaryValue.removeClass('secondary-value-up');
      }
    },

    updateValueSizeClass: function(value) {
      var str = value.toString().length;
      this.$value.removeClass("value-size-large");
      this.$value.removeClass("value-size-medium");
      this.$value.removeClass("value-size-small");

      if (str <= 5) {
        this.$value.addClass("value-size-large");
      } else if (str > 5 && str < 8) {
        this.$value.addClass("value-size-medium");
      } else {
        this.$value.addClass("value-size-small");
      }
    },

    render: function() {
      var value = this.value();
      var secondaryValue = this.secondaryValue();
      var secondaryValueString = Math.abs(secondaryValue).toString() + ' %';

      $(this.el).html(JST['templates/widgets/counter/show']({ value: value, secondaryValue: secondaryValueString }));

      this.$value = this.$('.value');
      this.$secondaryValue = this.$('.secondary-value');
      this.$arrow = this.$('.arrow');
      this.updateValueSizeClass(value);
      this.updateSecondaryValueClass(secondaryValue);

      return this;
    },

    update: function() {
      var that = this;
      this.counterModel.at = $.TimeSelector.getCurrent();
      this.secondaryCounterModel.at = $.TimeSelector.getFrom(this.range);
      var options = { suppressErrors: true };
      return $.when(this.counterModel.fetch(options), this.secondaryCounterModel.fetch(options)).done(this.updateValues());
    },

    updateValues: function() {
      var value = this.value();
      var secondaryValue = this.secondaryValue();
      var secondaryValueString = Math.abs(secondaryValue).toString() + ' %';
      this.$value.html(value);
      this.$secondaryValue.html(secondaryValueString);
    },

    onClose: function() {
      this.model.off();
    }
  });

})($, _, Backbone, app.views, app.models, app.collections);
