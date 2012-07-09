(function ($, _, Backbone, views, models, collections, TimeSelector){
  "use strict";

  var CounterSubview = Backbone.View.extend({

    className: 'double-row',

    initialize: function(options) {
      _.bindAll(this, "render");

      this.number = options.number;

      // this.updateCollection();
      // this.updateSecondaryCollection();
      this.updateModel();
    },

    fetchCollection: function() {
      return this.collection ? this.collection.fetch() : null;
    },

    fetchSecondaryCollection: function() {
      return this.secondaryCollection ? this.secondaryCollection.fetch() : null;
    },

    updateModel: function() {
      if (this.model.get('source') && this.getTargets()) {
        this.updateCollection();
        this.updateSecondaryCollection();
      }
    },

    from: function() {
      return TimeSelector.getFrom(new Date().getTime(), this.model.get('range'));
    },

    previousFrom: function() {
      return TimeSelector.getPreviousFrom(new Date().getTime(), this.model.get('range'));
    },

    to: function() {
      return TimeSelector.getCurrent();
    },

    getTargets: function() {
      return this.model.get('targets' + this.number);
    },

    getAggregateFunction: function() {
      return this.model.get('aggregate_function' + this.number) || 'sum';
    },

    updateCollection: function() {
      if (this.collection) {
        this.collection.off();
      }

      this.collection = new collections.Graph({
        targets: this.getTargets(),
        source: this.model.get('source'),
        aggregate_function: this.getAggregateFunction(),
        from: this.from(),
        to: this.to()
      });

      this.collection.on('reset', this.render);
    },

    updateSecondaryCollection: function() {
      if (this.secondaryCollection) {
        this.secondaryCollection.off();
      }

      this.secondaryCollection = new collections.Graph({
        time: this.model.get('time'),
        targets: this.getTargets(),
        source: this.model.get('source'),
        aggregate_function: this.getAggregateFunction(),
        from: this.previousFrom(),
        to: this.to()
      });
    },

    // example object: [{ target: "aggregated targets", datapoints: [[1776, 1340547208]] }]
    valueFromCollection: function(collection) {
      var datapoints = collection.at(0).get('datapoints');
      if (datapoints) {
        return datapoints[0][0];
      } else {
        return 0;
      }
    },

    value: function() {
      var result = this.valueFromCollection(this.collection);
      if (result % 1 === 0) {
        return result;
      } else {
        return result.toFixed(2);
      }
    },

    secondaryValue: function() {
      var y1 = this.valueFromCollection(this.collection);
      var y2 = this.valueFromCollection(this.secondaryCollection);
      if (y1 && y2) {
        var result = ((y1 - y2) / y2) * 100;
        if ( result % 1 === 0) {
          return result;
        } else {
          return result.toFixed(2);
        }
      } else {
        return 0;
      }
    },

    render: function() {
      if (this.collection && this.secondaryCollection) {
        var value = this.value();
        var secondaryValue = this.secondaryValue();
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
      if (this.collection) this.collection.off();
      if (this.secondaryCollection) this.secondaryCollection.off();
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
      this.counter1 = new CounterSubview({ model: this.model, number: 1 });
      this.addChildView(this.counter1);
      this.counter2 = new CounterSubview({ model: this.model, number: 2 });
      this.addChildView(this.counter2);

      return this;
    },

    update: function() {
      var that = this;
      var options = { suppressErrors: true };

      var validModels = [];
      this.forEachChild(function(child) {
        validModels.push(child.fetchCollection());
        validModels.push(child.fetchSecondaryCollection());
      });

      return $.when.apply(null, validModels);
    },

    onClose: function() {
      this.model.off();
      this.counter1.close();
      this.counter2.close();
    }
  });

})($, _, Backbone, app.views, app.models, app.collections, app.helpers.TimeSelector);
