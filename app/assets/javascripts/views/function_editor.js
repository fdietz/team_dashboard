(function ($, _, Backbone, List, views, models, collections, helpers) {
  "use strict";

  views.FunctionEditor = Backbone.View.extend({

    events: {
      "click .btn-primary"        : "save",
      "click .cancel"             : "cancel",
      "click .add-target"         : "addTarget",
      "click .add-function"       : "addFunction"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "save", "cancel", "addTarget", "addFunction");
      this.target = options.target;
    },

    render: function() {
      var that = this;

      this.$el.html(window.JST['templates/widget/function_edit']({ target: this.target }));
      this.$modal = this.$el.find('.modal');

      this.$functionEditor = this.$("#function-editor");

      this.$modal.on("shown", function() {
      });

      this.$modal.modal({
        keyboard: true,
        show: true,
        backdrop: 'static'
      });

      return this;
    },

    save: function() {
      this.trigger("inputChanged", this.$functionEditor.val());
      this.$modal.modal("hide");
      return false;
    },

    cancel: function() {
      this.$modal.modal("hide");
      return false;
    },

    addTarget: function() {
      var that = this;

      var browser = new views.TargetBrowser({ targets: this.collection.toJSON() });
      browser.on("selectionChanged", function(selection) {
        that.$functionEditor.insertAtCaret(selection);
      });
      this.$el.append(browser.render().el);

      return false;
    },

    addFunction: function() {
      var that = this;

      var browser = new views.FunctionBrowser({ targets: helpers.Graphite.listFunctions() });
      browser.on("selectionChanged", function(selection) {
        that.$functionEditor.insertAtCaret(selection);
      });

      this.$el.append(browser.render().el);
      return false;
    },

    onClose: function() {
    }

  });
})($, _, Backbone, List, app.views, app.models, app.collections, app.helpers);
