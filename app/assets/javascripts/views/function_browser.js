(function ($, _, Backbone, List, views, models, collections, helpers) {
  "use strict";

  views.FunctionBrowser = Backbone.View.extend({

    events: {
      "click .btn-primary"        : "save",
      "click .cancel"             : "cancel",
      "click .selectable-list"    : "selectionChanged",
      "dblclick .selectable-list" : "selectionChangedAndDone"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "save", "cancel", "selectionChanged");
      this.targets = options.targets;
    },

    render: function() {
      var that = this;

      this.$el.html(window.JST['templates/widget/function_browse']({}));
      this.$modal = this.$el.find('.modal');
      this.$list = this.$el.find("#filtered-list-container");
      this.$functionHelp = this.$el.find("#function-help");
      var options = {
          item: "<li class='f'><span class='name text'></span></li>",
          page: 200
      };
      this.list = new List(this.$list[0], options, this.targets);

      this.$modal.on("shown", function() {
        that.$el.find("#filter").focus();
        that.updateDocumentation("asPercent");
      });

      this.$modal.modal({
        keyboard: true,
        show: true,
        backdrop: 'static'
      });

      return this;
    },

    selectionChanged: function(event) {
      var target = $(event.target).closest("li");
      target.parent().find(".selected").removeClass("selected");
      target.addClass("selected");

      var currentSelection = target.find("span.text").clone().children().remove().end().text();
      this.updateDocumentation(currentSelection);

      return false;
    },

    updateDocumentation: function(name) {
      var f = helpers.Graphite.getFunction(name);
      var helpText = "<h5>Documentation</h5><p>" + f.description + "</p><h5>Example</h5><p>" + f.example + " </p>";
      this.$functionHelp.html(helpText);
    },

    selectionChangedAndDone: function(event) {
      var target = $(event.target).closest("li");
      target.parent().find(".selected").removeClass("selected");
      target.addClass("selected");
      this.save();
      return false;
    },

    save: function() {
      var selection = this.$list.find("li.selected").text();
      this.trigger("selectionChanged", selection);
      this.$modal.modal("hide");
      return false;
    },

    cancel: function() {
      this.$modal.modal("hide");
      return false;
    },

    onClose: function() {
    }

  });
})($, _, Backbone, List, app.views, app.models, app.collections, app.helpers);
