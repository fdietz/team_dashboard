(function ($, _, Backbone, views, models, collections) {
  "use strict";

  views.WidgetEditor.Counter = Backbone.View.extend({

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
      this.$targetInput2.val("");

      collections.metrics.source = source;
      collections.metrics.fetch().done(function() {
        that.$targetInput.select2({ tags: collections.metrics.autocomplete_names() });
        that.$targetInput2.select2({ tags: collections.metrics.autocomplete_names() });
      });
    },

    prefillAutocomplete: function() {
      var that = this;
      if (!collections.metrics.isFetched) {
        collections.metrics.fetch({ success: that.prefillAutocomplete });
        return;
      }
      this.$targetInput.select2({ tags: collections.metrics.autocomplete_names() });
      this.$targetInput2.select2({ tags: collections.metrics.autocomplete_names() });
    },

    render: function() {
      var that = this;
      $(this.el).html(JST['templates/widgets/counter/edit']({ model: this.model.toJSON(), sources: $.Sources.getDatapoints() }));

      this.populate("counter");
      this.$sourceSelect = this.$('.source');
      this.$targetInput = this.$('.targets');
      this.$targetInput.val(this.model.get('targets'));
      this.$targetInput2 = this.$('.targets2');
      this.$targetInput2.val(this.model.get('targets2'));

      this.prefillAutocomplete();

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

      var formResult = this.parse("counter");
      formResult.targets = this.$targetInput.select2('val').join(',');
      formResult.targets2 = this.$targetInput2.select2('val').join(',');
      console.log("form", formResult)
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
