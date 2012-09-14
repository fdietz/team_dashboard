(function ($, _, Backbone, List, views, models, collections) {
  "use strict";

  views.TargetBrowser = Backbone.View.extend({

    events: {
      "click .btn-primary"        : "save",
      "click .cancel"             : "cancel",
      "click .selectable-list"    : "selectionChanged",
      "dblclick .selectable-list" : "selectionChangedAndDone"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "save", "cancel", "selectionChanged", "displayList");
    },

    render: function() {
      var that = this;

      this.$el.html(JST['templates/widget/browse']({}));
      this.$modal = this.$el.find('.modal');
      this.$listContainer = this.$el.find("#filtered-list-container");
      this.$list = this.$("#list");
      this.$ajaxSpinner = this.$el.find(".ajax-spinner");

      this.$modal.on("shown", function() {
        that.$el.find("#filter").focus();
      });

      this.$modal.modal({
        keyboard: true,
        show: true,
        backdrop: 'static'
      });

      if (this.collection.populated === true) {
        this.targets = this.collection.toJSON();
        this.displayList();
      } else {
        this.collection.fetch().done(this.displayList);
      }

      return this;
    },

    displayList: function() {
      this.targets = this.collection.toJSON();
      var options = {
          item: "<li class='f'><span class='name text'></span></li>",
          page: 200
      };
      this.$ajaxSpinner.hide();
      this.$listContainer.show();
      this.list = new List(this.$listContainer[0], options, this.targets);
    },

    selectionChanged: function(event) {
      var target = $(event.target).closest("li");
      target.parent().find(".selected").removeClass("selected");
      target.addClass("selected");
      return false;
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
})($, _, Backbone, List, app.views, app.models, app.collections);
