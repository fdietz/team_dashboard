(function ($, _, Backbone, views, models, collections){
  "use strict";

  views.widgets.Counter = Backbone.View.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "update", "widgetChanged");

      this.range = '30-minutes';

      this.updateCounterModel();
      this.updateSecondaryCounterModel();
      this.updateCounterModel2();
      this.updateSecondaryCounterModel2();

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

    updateCounterModel2: function() {
      this.counterModel2 = new models.Counter({
        targets: this.model.get('targets2'),
        source: this.model.get('source'),
        aggregate_function: 'sum',
        at: $.TimeSelector.getCurrent()
      });
    },

    updateSecondaryCounterModel2: function() {
      this.secondaryCounterModel2 = new models.Counter({
        targets: this.model.get('targets2'),
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

    value2: function() {
      return this.counterModel2.get('value') || 0;
    },

    secondaryValue2: function() {
      var y1 = this.counterModel2.get('value') || 0;
      var y2 = this.secondaryCounterModel2.get('value') || 0;
      if (y1 && y2) {
        var result = ((y1 - y2) / y2) * 100;
        return result.toFixed(2);
      } else {
        return 0;
      }
    },

    updateSecondaryValueClass: function(element, arrowElement, secondaryValue) {
      if (secondaryValue > 0) {
        arrowElement.removeClass('arrow-down');
        arrowElement.addClass('arrow-up');
        element.addClass('secondary-value-up');
        element.removeClass('secondary-value-down');
      } else {
        arrowElement.addClass('arrow-down');
        arrowElement.removeClass('arrow-up');
        element.addClass('secondary-value-down');
        element.removeClass('secondary-value-up');
      }
    },

    updateValueSizeClass: function(element, value) {
      var str = value.toString().length;
      element.removeClass("value-size-large");
      element.removeClass("value-size-medium");
      element.removeClass("value-size-small");

      if (str <= 5) {
        element.addClass("value-size-large");
      } else if (str > 5 && str < 8) {
        element.addClass("value-size-medium");
      } else {
        element.addClass("value-size-small");
      }
    },

    render: function() {
      var value = this.value();
      var secondaryValue = this.secondaryValue();
      var value2 = this.value2();
      var secondaryValue2 = this.secondaryValue2();

      $(this.el).html(JST['templates/widgets/counter/show']({
        value: value,
        secondaryValue: Math.abs(secondaryValue),
        value2: value2,
        secondaryValue2: Math.abs(secondaryValue2)
      }));

      this.$value = this.$('.counter .value');
      this.$value2 = this.$('.counter2 .value');
      this.$secondaryValue = this.$('.counter .secondary-value');
      this.$secondaryValue2 = this.$('.counter2 .secondary-value');
      this.$arrow = this.$('.counter .arrow');
      this.$arrow2 = this.$('.counter2 .arrow');
      this.$rateContainer = this.$('.counter .rate-container');
      this.$rateContainer2 = this.$('.counter2 .rate-container');

      this.updateValueSizeClass(this.$value, value);
      this.updateValueSizeClass(this.$value2, value2);
      this.updateSecondaryValueClass(this.$rateContainer, this.$arrow, secondaryValue);
      this.updateSecondaryValueClass(this.$rateContainer2, this.$arrow2, secondaryValue2);

      return this;
    },

    update: function() {
      var that = this;
      this.counterModel.at = $.TimeSelector.getCurrent();
      this.secondaryCounterModel.at = $.TimeSelector.getFrom(this.range);
      this.counterModel2.at = $.TimeSelector.getCurrent();
      this.secondaryCounterModel2.at = $.TimeSelector.getFrom(this.range);
      var options = { suppressErrors: true };
      return $.when(
        this.counterModel.fetch(options),
        this.secondaryCounterModel.fetch(options),
        this.counterModel2.fetch(options),
        this.secondaryCounterModel2.fetch(options)
      ).done(this.render());
    },

    onClose: function() {
      this.model.off();
    }
  });

})($, _, Backbone, app.views, app.models, app.collections);
