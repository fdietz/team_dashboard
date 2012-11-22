(function ($, _, Backbone, views, models){
  "use strict";

  var CounterSubview = Backbone.View.extend({

    className: 'double-row',

    initialize: function(options) {
      _.bindAll(this, "render");
      this.widgetModel = options.widgetModel;
      this.number = options.number;

      this.model = new models.CounterDelegate({
        range : this.widgetModel.get("range"),
        targets: this.widgetModel.get('targets' + this.number),
        source:  this.widgetModel.get('source' + this.number),
        aggregate_function: this.widgetModel.get('aggregate_function' + this.number)
      });

      this.model.on('change', this.render);
    },

    fetchModel: function() {
      return this.model.fetchAll({ suppressErrors: true });
    },

    updateModel: function() {
      this.model.updateAll();
    },

    render: function() {
      if (this.model && this.model.isPopulated()) {
        var value = this.model.value();
        var secondaryValue = this.model.secondaryValue();
        this.$el.html(JST['templates/widgets/counter/subview']({
          value: value,
          secondaryValue: secondaryValue
        }));

        this.$value = this.$('.value');
        this.$arrow = this.$('.arrow');
        this.$secondaryValueContainer = this.$('.secondary-value-container');

        this.updateValueSizeClass(value);
        this.updateSecondaryValueClass(secondaryValue);
      }

      return this;
    },

    updateSecondaryValueClass: function(secondaryValue) {
      var up = secondaryValue > 0;
      this.$arrow.toggleClass('arrow-up', up);
      this.$arrow.toggleClass('arrow-down', !up);
      this.$secondaryValueContainer.toggleClass('color-up', up);
      this.$secondaryValueContainer.toggleClass('color-down', !up);
    },

    updateValueSizeClass: function(value) {
      var str = value.toString().length;

      this.$value.toggleClass("value-size-large", str <= 5);
      this.$value.toggleClass("value-size-medium", str > 5 && str < 8);
      this.$value.toggleClass("value-size-small", str >= 8);
    },

    onClose: function() {
      this.widgetModel.off();
      if (this.model) this.model.off();
    }

  });

  views.widgets.Counter = Backbone.CompositeView.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "update", "widgetChanged");

      this.model.on('change', this.widgetChanged);
    },

    widgetChanged: function() {
      this.forEachChild(function(child) {
        child.updateModel();
      });
      this.render();
    },

    render: function() {
      if (this.model.get("source1")) {
        this.counter1 = new CounterSubview({ widgetModel: this.model, number: 1 });
        this.addChildView(this.counter1);
      }

      if (this.model.get("source2")) {
        this.counter2 = new CounterSubview({ widgetModel: this.model, number: 2 });
        this.addChildView(this.counter2);
      }

      return this;
    },

    update: function() {
      var that = this;

      var validModels = [];
      this.forEachChild(function(child) {
        validModels.push(child.fetchModel());
      });

      return $.when.apply(null, validModels);
    },

    onClose: function() {
      this.model.off();
      if (this.counter1) {
        this.counter1.close();
      }
      if (this.counter2) {
        this.counter2.close();
      }
    }
  });

})($, _, Backbone, app.views, app.models);
