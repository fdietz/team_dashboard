(function ($, _, Backbone, List, views, models, collections) {
  "use strict";

  views.TargetBrowser = Backbone.View.extend({

    events: {
      "click .btn-primary"        : "save",
      "click .cancel"             : "cancel",
      "click .selectable-list"    : "selectionChanged",
      "dblclick .selectable-list" : "selectionChangedAndDone",
      "click .search"             : "search",
      "keyup #filter"             : "searchByKeyboard"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "save", "cancel", "selectionChanged", "displayList", "search", "searchByKeyboard");
    },

    render: function() {
      var that = this;

      this.$el.html(JST['templates/widget/browse']({}));

      this.$listContainer = this.$("#filtered-list-container");
      this.$list = this.$("#list");
      this.$ajaxSpinner = this.$(".ajax-spinner");
      this.$patternInput = this.$("#filter");
      this.$searchButton = this.$(".search");
      this.toggleSearch(false);
      this.displayList();

      this.$modal = this.$('.modal');
      this.$modal.on("shown", function() {
        that.$("#filter").focus();

        if (that.collection.populated === true) {
          that.displayList();
        } else {
          that.search();
        }

      });

      this.$modal.modal({
        keyboard: true,
        show: true,
        backdrop: 'static'
      });

      return this;
    },

    displayList: function() {
      var options = {
          item: "<li class='f'><span class='name text'></span></li>",
          page: 200
      };
      this.$ajaxSpinner.hide();
      this.$list.show();
      this.list = new List(this.$listContainer[0], options, this.collection.toJSON());
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

    searchByKeyboard: function(event) {
      if (event.keyCode == 13 && this.$patternInput.val().length > 0) this.search();
      return false;
    },

    search: function(event) {
      var that = this;
      this.collection.pattern = this.$patternInput.val();
      that.toggleSearch(true);
      this.collection.fetch().done(function() {
        that.toggleSearch(false);
        that.displayList();
      });
      return false;
    },

    toggleSearch: function(searchRunning) {
      if (searchRunning === true) {
        this.$searchButton.attr("disable", "disable");
        this.$ajaxSpinner.show();
        this.$list.hide();
      } else {
        this.$searchButton.removeAttr("disable");
        this.$ajaxSpinner.hide();
        this.$list.show();
      }
    },

    onClose: function() {
    }

  });
})($, _, Backbone, List, app.views, app.models, app.collections);
