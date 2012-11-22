(function ($, _, Backbone, views, models, collections) {
  "use strict";

  Backbone.Form.editors.List.Modal.ModalAdapter = Backbone.BootstrapModal;

  views.WidgetEditor = Backbone.View.extend({

    events: {
      "click .btn-primary" : "save",
      "change .source"     : "sourceChanged"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "save", "sourceChanged");
      this.editor = options.editor;
      this.dashboard = options.dashboard;
      this.widgetCollection = options.widgetCollection;
    },

    sourceChanged: function() {
      var that = this;
      var source = this.$sourceSelect.val();
    },

    render: function() {
      var that = this;

      this.$el.html(JST['templates/widget/edit']({}));
      this.$modalBody = this.$el.find('.modal-body');
      this.$modalBody.html(this.editor.render().el);
      this.$modal = this.$el.find('.modal');

      this.$modal.modal({
        keyboard: true,
        show: true,
        backdrop: 'static'
      });

      return this;
    },

    save: function() {
      var that = this;

      var validationResult = this.editor.validate();
      if (validationResult) {
        console.log("validation error", validationResult);
      } else {
        this.$modal.modal("hide");
        var formResult = this.editor.getValue();
        if (this.model.isNew()) {
          this.model.set(formResult);
          this.widgetCollection.create(this.model, { wait: true });
        } else {
          this.model.save(formResult);
        }
      }

      return false;
    },

    onClose: function() {
    }

  });
})($, _, Backbone, app.views, app.models, app.collections);
