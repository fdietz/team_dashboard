(function ($, _, Backbone, models, TimeSelector) {
  "use strict";

  models.Counter = Backbone.Model.extend({
    initialize: function(options) {
      this.targets = options.targets;
      this.from = options.from;
      this.to = options.to;
      this.source = options.source;
      this.targetsArray = (this.targets || "").split(';');
      this.aggregate_function = options.aggregate_function;
    },

    buildTargetsParams: function() {
      return _.map(this.targetsArray, function(target) {
        return "targets[]=" + encodeURIComponent(target);
      }).join('&');
    },

    buildDateRangeParams: function() {
      var result = "from=" + encodeURIComponent(this.from) + "&to=" + encodeURIComponent(this.to);
      return result;
    },

    url: function() {
      var params = [this.buildTargetsParams(), this.buildDateRangeParams(), 'source=' + encodeURIComponent(this.source)];
      if (this.aggregate_function) {
        params.push("aggregate_function=" + this.aggregate_function);
      }
      return "/api/counter?" + params.join('&');
    }
  });

  // Delegates to primary and secondaryModel
  models.CounterDelegate = Backbone.Model.extend({
    populated: false,

    initialize: function(options) {
      this.range = options.range;

      this.primaryModel = new models.Counter({
        targets: options.targets,
        source: options.source,
        aggregate_function: options.aggregate_function,
        from: this.from(),
        to: this.to()
      });

      this.secondaryModel = new models.Counter({
        targets: options.targets,
        source: options.source,
        aggregate_function: options.aggregate_function,
        from: this.previousFrom(),
        to: this.from()
      });
    },

    isPopulated: function() {
      return this.populated === true;
    },

    fetchAll: function() {
      var that = this;
      return $.when(this.fetchPrimaryModel(), this.fetchSecondaryModel()).done(function() {
        that.populated = true;
        that.trigger("change");
      });
    },

    fetchPrimaryModel: function() {
      return this.primaryModel.fetch({ suppressErrors: true });
    },

    fetchSecondaryModel: function() {
      return this.secondaryModel.fetch({ suppressErrors: true });
    },

    updateAll: function() {
      this.updatePrimaryModel();
      this.updateSecondaryModel();
    },

    updatePrimaryModel: function() {
      this.primaryModel.set({
        from: this.from(),
        to: this.to()
      });
    },

    updateSecondaryModel: function() {
      this.secondaryModel.set({
        from: this.previousFrom(),
        to: this.from()
      });
    },

    from: function() {
      return TimeSelector.getFrom(new Date().getTime(), this.range);
    },

    previousFrom: function() {
      return TimeSelector.getPreviousFrom(new Date().getTime(), this.range);
    },

    to: function() {
      return TimeSelector.getCurrent();
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

    onClose: function() {
      this.primaryModel.off();
      this.secondaryModel.off();
    }

  });

})($, _, Backbone, app.models, app.helpers.TimeSelector);
