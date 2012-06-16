(function ($, _, Backbone, views, models, collections){
  "use strict";

  views.widgets.Counter = Backbone.View.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "onValueChange", "onSecondaryValueChange", "update", "updateValueSizeClass");

      console.log("models", models);

      this.range = '30-minutes';
      this.value = 0;
      this.secondaryValue = 0;

      this.counterModel = new models.Counter({
        targets: this.model.get('targets'),
        source: this.model.get('source'),
        aggregate_function: 'sum',
        at: $.TimeSelector.getCurrent()
      });

      this.secondaryCounterModel = new models.Counter({
        targets: this.model.get('targets'),
        source: this.model.get('source'),
        aggregate_function: 'sum',
        at: $.TimeSelector.getFrom(this.range)
      });

      this.counterModel.on('change', this.onValueChange);
      this.secondaryCounterModel.on('change', this.onSecondaryValueChange);
      this.model.on('change', this.widgetChanged);

      this.counterModel.fetch();
      this.secondaryCounterModel.fetch();
    },

    widgetChanged: function() {
      this.counterModel = new models.CounterModel({
        targets: this.model.get('targets'),
        source: this.model.get('source'),
        aggregate_function: 'sum',
        at: $.TimeSelector.getCurrent()
      });

      this.secondaryCounterModel = new models.Counter({
        targets: this.model.get('targets'),
        source: this.model.get('source'),
        aggregate_function: 'sum',
        at: $.TimeSelector.getFrom(this.range)
      });
    },

    onValueChange: function() {
      console.log("value", this.counterModel, this.counterModel.get('value'));
      this.value = this.counterModel.get('value');
      this.$value.html(this.value);

      this.updateValueSizeClass();
    },

    onSecondaryValueChange: function() {
      console.log("rate", this.secondaryCounterModel, this.secondaryCounterModel.get('value'))
      var y1 = this.counterModel.get('value');
      var y2 = this.secondaryCounterModel.get('value');
      var result = ((y1 - y2) / y2) * 100;
      this.secondaryValue = result.toFixed(2);
      console.log("y1", y1, "y2", y2, this.secondaryValue);

      this.$arrow.removeClass('arrow-up');
      this.$arrow.removeClass('arrow-down');

      this.$secondaryValue.removeClass('secondary-value-up');
      this.$secondaryValue.removeClass('secondary-value-down');
      if (this.secondaryValue > 0) {
        this.$arrow.addClass('arrow-up');
        this.$secondaryValue.addClass('secondary-value-up');
      } else {
        this.$arrow.addClass('arrow-down');
        this.$secondaryValue.addClass('secondary-value-down');
      }
      this.$secondaryValue.html(Math.abs(this.secondaryValue).toString() + ' %');
    },


    updateValueSizeClass: function() {
      var str = this.value.toString().length;
      console.log("this.value.length", str, str.length);
      this.$(".value").removeClass("value-size-large");
      this.$(".value").removeClass("value-size-medium");
      this.$(".value").removeClass("value-size-small");

      if (str <= 5) {
        this.$(".value").addClass("value-size-large");
      } else if (str > 5 && str < 8) {
        this.$(".value").addClass("value-size-medium");
      } else {
        this.$(".value").addClass("value-size-small");
      }
    },

    render: function() {
      var that = this;

      $(this.el).html(JST['templates/widgets/counter/show']({ value: this.value, secondaryValue: this.secondaryValue }));

      this.$value = this.$('.value');
      this.$secondaryValue = this.$('.secondary-value');
      this.$arrow = this.$('.arrow');

      this.$(".value").addClass("value-size-large");

      // var str = this.value.toString().length;
      // console.log("this.value.length", str, str.length);
      // if (str <= 5) {
      //   this.$(".value").addClass("value-size-large");
      // } else if (str > 5 && str < 8) {
      //   this.$(".value").addClass("value-size-medium");
      // } else {
      //   this.$(".value").addClass("value-size-small");
      // }

      return this;
    },

    update: function(callback) {
      var that = this;
      console.log("update");

      this.counterModel.at = $.TimeSelector.getCurrent();
      this.secondaryCounterModel.at = $.TimeSelector.getFrom(this.range);

      this.counterModel.fetch({ complete: function() {
        that.hideAjaxSpinner();
        if (callback) { callback(); }
      }});
      this.secondaryCounterModel.fetch();
      // var that = this;

      // this.counterModel.fetch({
      //   success: function(model, response) {},
      //   error: function(model, response) { that.showLoadingError(); },
      //   complete: function(model, response) {
      //     that.hideAjaxSpinner();
      //     if (callback) { callback(); }
      //   },
      //   suppressErrors: true
      // });
    },

    hideAjaxSpinner: function() {
      $(this.el).parent().parent().find(".ajax-spinner").hide();
    },

    showLoadingError: function() {
      $(this.el).html("<div><p>Error loading datapoints...</p></div>");
    },

    onClose: function() {
      this.counterModel.off('change', this.render);
      this.secondaryCounterModel.off('change', this.render);
      this.model.off('change', this.render);
    }
  });

})($, _, Backbone, app.views, app.models, app.collections);
