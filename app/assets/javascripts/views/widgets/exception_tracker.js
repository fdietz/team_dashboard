(function ($, _, Backbone, views, models, collections){
  "use strict";

  var ExceptionTrackerSubview = Backbone.View.extend({

    className: 'triple-row',

    initialize: function(options) {
      _.bindAll(this, "render");
      this.widget = options.widget;
      this.number = options.number;
      this.updateModel();
    },

    fetch: function() {
      return this.model ? this.model.fetch({ suppressErrors: true }) : null;
    },

    updateModel: function() {
      var that = this;

      if (this.getSource()) {
        if (this.model) {
          this.model.off();
        }

        var options = { source: this.getSource() };
        var fields = {};
        var plugin = _.find($.Sources.exception_tracker, function(plugin) {
          return that.getSource() === plugin.name;
        });

        if (plugin) {
          _.each(plugin.fields, function(field) {
            fields[field.name] = that.widget.get(plugin.name + "-" + field.name + that.number);
          });
        }

        this.model = new models.ExceptionTracker(_.extend(options, { fields: fields } ));
        this.model.on('change', this.render);
      }
    },

    getSource: function() {
      return this.widget.get("source" + this.number);
    },

    getLabel: function() {
      return this.model.get("label") || this.widget.get("label" + this.number);
    },

    render: function() {
      if (this.model && this.model.isPopulated()) {
        var unresolved = this.model.get("unresolved_errors");

        this.$el.html(JST['templates/widgets/exception_tracker/subview']({
          label: this.getLabel(),
          lastErrorTime: this.model.get("last_error_time"),
          unresolvedErrors: this.model.get("unresolved_errors")
        }));

        this.$value = this.$('.number-value');
        // Green for 0, red for any unresolved errors
        this.$value.toggleClass('color-up', unresolved === 0);
        this.$value.toggleClass('color-down', unresolved > 0);

        this.$(".timeago").timeago();
      }

      return this;
    },

    onClose: function() {
      if (this.model) this.model.off();
    }

  });

  views.widgets.ExceptionTracker = Backbone.CompositeView.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "update", "widgetChanged");
      this.updateExceptionTrackerModels();
      this.model.on('change', this.widgetChanged);
    },

    updateExceptionTrackerModels: function() {
      this.forEachChild(function(child) {
        child.updateModel();
      });
    },

    widgetChanged: function() {
      this.updateExceptionTrackerModels();
      this.render();
    },

    render: function() {
      this.view1 = new ExceptionTrackerSubview({ widget: this.model, number: 1 });
      this.addChildView(this.view1);

      this.view2 = new ExceptionTrackerSubview({ widget: this.model, number: 2 });
      this.addChildView(this.view2);

      this.view3 = new ExceptionTrackerSubview({ widget: this.model, number: 3 });
      this.addChildView(this.view3);

      return this;
    },

    update: function() {
      var that = this;
      var validModels = [];
      this.forEachChild(function(child) {
        validModels.push(child.fetch());
      });
      return $.when.apply(null, validModels);
    },

    onClose: function() {
      this.model.off();
    }
  });

})($, _, Backbone, app.views, app.models, app.collections);
