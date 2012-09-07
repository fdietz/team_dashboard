(function ($, _, Backbone, views, models, collections, TimeSelector){
  "use strict";

  var CounterSubview = Backbone.View.extend({

    className: 'double-row',

    initialize: function(options) {
      _.bindAll(this, "render");

      this.number = options.number;
      this.updateModels();
    },

    fetchPrimaryModel: function() {
      return this.primaryModel ? this.primaryModel.fetch({ suppressErrors: true }) : null;
    },

    fetchSecondaryModel: function() {
      return this.secondaryModel ? this.secondaryModel.fetch({ suppressErrors: true }) : null;
    },

    updateModels: function() {
      if (this.getSource() && this.getTargets()) {
        this.updatePrimaryModel();
        this.updateSecondaryModel();
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

    getSource: function() {
      return this.model.get('source' + this.number);
    },

    getTargets: function() {
      return this.model.get('targets' + this.number);
    },

    getAggregateFunction: function() {
      return this.model.get('aggregate_function' + this.number);
    },

    getHttpProxyUrl: function() {
      return this.model.get("http_proxy_url" + this.number);
    },

    updatePrimaryModel: function() {
      if (this.primaryModel) {
        this.primaryModel.off();
      }

      this.primaryModel = new models.Counter({
        targets: this.getTargets(),
        source: this.getSource(),
        aggregate_function: this.getAggregateFunction(),
        from: this.from(),
        to: this.to(),
        http_proxy_url: this.getHttpProxyUrl()
      });

      this.primaryModel.on('change', this.render);
    },

    updateSecondaryModel: function() {
      if (this.secondaryModel) {
        this.secondaryModel.off();
      }

      this.secondaryModel = new models.Counter({
        time: this.model.get('time'),
        targets: this.getTargets(),
        source: this.getSource(),
        aggregate_function: this.getAggregateFunction(),
        from: this.previousFrom(),
        to: this.from(),
        http_proxy_url: this.getHttpProxyUrl()
      });
    },

    value: function() {
      var result = this.primaryModel.get('value') || 0;
      if (result % 1 === 0) {
        return result;
      } else {
        return result.toFixed(2);
      }
    },

    secondaryValue: function() {
      var y1 = this.primaryModel.get('value');
      var y2 = this.secondaryModel.get('value');
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
      if (this.primaryModel && this.primaryModel.isPopulated() && this.secondaryModel && this.secondaryModel.isPopulated()) {
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
      this.model.off();
      if (this.primaryModel) this.primaryModel.off();
      if (this.secondaryModel) this.secondaryModel.off();
    }

  });

  views.widgets.Counter = Backbone.CompositeView.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "update", "widgetChanged");

      this.model.on('change', this.widgetChanged);
    },

    widgetChanged: function() {
      this.forEachChild(function(child) {
        child.updateModels();
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
        validModels.push(child.fetchPrimaryModel());
        validModels.push(child.fetchSecondaryModel());
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
