(function ($, _, Backbone, views, models, collections) {
  "use strict";

  views.WidgetEditor.Boolean = Backbone.View.extend({

    events: {
      "click .btn-primary" : "save",
      "change .source"     : "sourceChanged"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "save", "sourceChanged");
      this.dashboard = options.dashboard;
      this.widgetCollection = options.widgetCollection;
    },

    sourceChanged: function() {
      var that = this;
      var source = this.$sourceSelect.val();
    },

    render: function() {
      var that = this;
      var sources = $.Sources.getBoolean();
      sources.unshift(null);
      this.$el.html(JST['templates/widgets/boolean/edit']({ model: this.model.toJSON(), sources: sources }));

      this.populate("boolean");
      this.$sourceSelect = this.$('.source');

      this.$modal = this.$('#dashboard-details-modal');
      this.$nameInput = this.$('input.name');
      this.$modal.on("shown", function() {
        setTimeout(function() {
          that.$nameInput.focus();
        }, 10);
      });

      this.$modal.modal({
        keyboard: true,
        show: true,
        backdrop: 'static'
      });
      return this;
    },

    save: function() {
      var that = this;
      this.$modal.modal("hide");

      var formResult = this.parse("boolean");
      
      if (this.model.isNew()) {
        this.model.set(formResult, { silent: true });
        this.widgetCollection.create(this.model);
      } else {
        this.model.save(formResult).done(function() {
          that.dashboard.trigger("widget:changed", that.model);
        });
      }

      return false;
    },

    onClose: function() {
      this._modelBinder.unbind();
    }

  });
})($, _, Backbone, app.views, app.models, app.collections);
