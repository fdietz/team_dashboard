(function ($, _, Backbone, views, models, collections){
  "use strict";

  var CounterSubview = Backbone.View.extend({

    className: 'counter',

    initialize: function(options) {
      _.bindAll(this, "render");

      this.secondaryModel = options.secondaryModel;
    },

    value: function() {
      return this.model.get('value') || 0;
    },

    secondaryValue: function() {
      var y1 = this.model.get('value') || 0;
      var y2 = this.secondaryModel.get('value') || 0;
      if (y1 && y2) {
        var result = ((y1 - y2) / y2) * 100;
        return result.toFixed(2);
      } else {
        return 0;
      }
    },

    render: function() {
      var value = this.value();
      var secondaryValue = this.secondaryValue();

      $(this.el).html(JST['templates/widgets/counter/subview']({ 
        value: Math.abs(value),
        secondaryValue: Math.abs(secondaryValue)
      }));

      this.$value = this.$('.value');
      this.$secondaryValue = this.$('.secondary-value');
      this.$arrow = this.$('.arrow');
      this.$rateContainer = this.$('.rate-container');

      this.updateValueSizeClass(value);
      this.updateSecondaryValueClass(secondaryValue);

      return this;
    },

    updateSecondaryValueClass: function(secondaryValue) {
      if (secondaryValue > 0) {
        this.$arrow.removeClass('arrow-down');
        this.$arrow.addClass('arrow-up');
        this.$rateContainer.addClass('secondary-value-up');
        this.$rateContainer.removeClass('secondary-value-down');
      } else {
        this.$arrow.addClass('arrow-down');
        this.$arrow.removeClass('arrow-up');
        this.$rateContainer.addClass('secondary-value-down');
        this.$rateContainer.removeClass('secondary-value-up');
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
    }

  });

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

    render: function() {
      this.counter1 = new CounterSubview({ model: this.counterModel, secondaryModel: this.secondaryCounterModel });
      this.counter2 = new CounterSubview({ model: this.counterModel2, secondaryModel: this.secondaryCounterModel2 });

      $(this.el).empty();
      $(this.el).append(this.counter1.render().el);
      $(this.el).append(this.counter2.render().el);

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
