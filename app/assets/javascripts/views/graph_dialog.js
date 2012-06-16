(function ($, _, Backbone, views, models, collections) {
  "use strict";

  views.GraphDialog = Backbone.View.extend({

    events: {
      "click .btn-primary" : "save"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "prefillAutocomplete");
      this.dashboard = options.dashboard;
    },

    prefillAutocomplete: function() {
      var that = this;
      if (!collections.metrics.isFetched) {
        collections.metrics.fetch({ success: that.prefillAutocomplete });
        return;
      }
      this.targetInput.select2({ tags: collections.metrics.autocomplete_names() });
    },

    render: function() {
      $(this.el).html(JST['templates/widgets/graph/edit']({ model: this.model.toJSON() }));

      this.populate("graph");
      this.targetInput = this.$('.targets');
      this.prefillAutocomplete();

      var myModal = this.$('#dashboard-details-modal');
      var nameInput = this.$('input.name');
      myModal.on("shown", function() { nameInput.blur().focus(); });
      myModal.modal({ keyboard: true });
      return this;
    },

    save: function() {
      var that = this;
      var myModal = this.$('#dashboard-details-modal');
      myModal.modal("hide");

      var formResult = this.parse("graph");
      formResult.targets = this.targetInput.select2('val').join(',');

      var result = this.model.save(formResult, {
        success: function(model, request) {
          console.log("save mode", model);
          that.dashboard.updateLayout(model.id);
          that.dashboard.trigger("widgets:changed");
        }
      });

      return false;
    },

    onClose: function() {
    }

  });
})($, _, Backbone, app.views, app.models, app.collections);
