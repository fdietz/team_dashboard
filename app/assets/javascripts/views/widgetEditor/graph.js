(function ($, _, Backbone, views, models, collections) {
  "use strict";

  views.WidgetEditor.Graph = Backbone.View.extend({

    events: {
      "click .btn-primary" : "save",
      "change .source"     : "sourceChanged"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "prefillAutocomplete", "save", "sourceChanged");
      this.dashboard = options.dashboard;
      this.widgetCollection = options.widgetCollection;
      collections.metrics.source = this.model.get('source');
    },

    sourceChanged: function() {
      var that = this;
      var source = this.$sourceSelect.val();
      this.$targetInput.val("");

      collections.metrics.source = source;
      collections.metrics.fetch().done(function() {
        that.targetInput.select2({ tags: collections.metrics.autocomplete_names() });
      });
    },

    prefillAutocomplete: function() {
      var that = this;
      if (!collections.metrics.isFetched) {
        collections.metrics.fetch({ success: that.prefillAutocomplete });
        return;
      }
      this.$targetInput.select2({ tags: collections.metrics.autocomplete_names() });
    },

    render: function() {
      var that = this;
      this.$el.html(JST['templates/widgets/graph/edit']({ model: this.model.toJSON(), sources: $.Sources.getDatapoints() }));

      this.populate("graph");
      this.$targetInput = this.$('.targets');
      this.$sourceSelect = this.$('.source');

      this.prefillAutocomplete();

      this.$modal = this.$('#dashboard-details-modal');
      this.$nameInput = this.$('.name');
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
      var formResult = this.parse("graph");
      formResult.targets = this.$targetInput.select2('val').join(',');

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
    }

  });
})($, _, Backbone, app.views, app.models, app.collections);
