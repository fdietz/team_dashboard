(function ($, _, Backbone, List, views, models) {
  "use strict";

  views.TextfieldWithList = Backbone.View.extend({

    events: {
      "keyup input"   : "handleKeyboard",
      "click .remove" : "handleRemove",
      "click .edit"   : "handleEdit",
      "click .add"    : "handleButtonAdd",
      "click .browse" : "handleButtonBrowse"
    },

    initialize: function(options) {
      _.bindAll(this, "handleKeyboard", "handleRemove", "handleEdit", "handleButtonAdd", "handleButtonBrowse");

      this.$originalInput = options.originalInput;

      this.browseCallback = options.browseCallback;
      this.editCallback   = options.editCallback;
    },

    render: function() {
      this.$el.html(JST['templates/textfield_with_list']({}));

      this.$input       = this.$("input"),
      this.$browse      = this.$(".browse"),
      this.$add         = this.$(".add"),
      this.$list        = this.$("ul"),
      this.$remove      = this.$(".remove");
      this.$placeholder = this.$(".help-block");

      this.$originalInput.hide();

      this.populate();

      return this;
    },

    populate: function() {
      var that = this;

      this.list = new List(this.$el[0], { item: this.template() });
      _.each(this._stringToValues(), function(value) {
        that.list.add({ name: value });
      });

      if (this.list.size() === 0) {
        this.$list.hide();
      } else {
        this.$placeholder.hide();
      }
      this._disableAddButton();
    },

    toggleListVisibility: function() {
      if (this.$originalInput.val().length === 0) {
        this.$list.hide();
        this.$placeholder.show();
      } else {
        this.$list.show();
        this.$placeholder.hide();
      }
    },

    _nameMapping: function(value) {
      return { name: value };
    },

    addItem: function() {
      this.$list.show();
      this.list.add({ name: this.$input.val() });
      this.updateResult();
      this.$input.val("");
      this._disableAddButton();
    },

    template: function() {
      var iconEdit = "<span class='edit icon-wrench'></span>",
          iconRemove = "<span class='remove icon-remove'></span>",
          icons, text, li = null;

      icons = "<span class='actions'>";
      if (this.editCallback) icons += iconEdit;
      icons += iconRemove + "</span>";

      text  = "<span class='text name'></span>",
      li    = "<li>"+ text + icons +"</li>";

      return li;
    },

    _valueMapping: function(el) {
      return el.values().name;
    },

    _valuesToString: function() {
      return _.map(this.list.items, this._valueMapping).join(";");
    },

    _stringToValues: function() {
      return _.reject(this.$originalInput.val().split(";"), function(value) {
        return value.length === 0;
      });
    },

    updateResult: function() {
      this.$originalInput.val(this._valuesToString());
      this.toggleListVisibility();
    },

    _enableAddButton: function() {
      this.$add.removeAttr("disabled");
    },

    _disableAddButton: function() {
      this.$add.attr("disabled", "disabled");
    },

    handleKeyboard: function(event) {
      this.$input.val().length > 0 ? this._enableAddButton() : this._disableAddButton();
      if (event.keyCode == 13 && this.$input.val().length > 0) this.addItem();
      return false;
    },

    handleRemove: function(event) {
      var selectedValue = $(event.currentTarget).closest("li").find(".name").text();
      this.list.remove("name", selectedValue);
      this.updateResult();
      return false;
    },

    handleEdit: function(event) {
      var selectedValue = $(event.currentTarget).closest("li").find(".name").text();
      if (this.editCallback) this.editCallback(selectedValue, event);
      return false;
    },

    handleButtonAdd: function(event) {
      if (this.$input.val().length > 0) this.addItem();
      return false;
    },

    handleButtonBrowse: function(event) {
      if (this.browseCallback) this.browseCallback(event);
      return false;
    },

    update: function(before, after) {
      var current = this.list.get("name", before);
      var $name = $(current.elm).find(".name");
      current.values().name = after;
      $name.text(after);
      this.updateResult();
    },

    add: function(value) {
      this.list.add({ name: value });
      this.updateResult();
    },

    onClose: function() {
      this.$originalInput.show();
    }

  });

  })($, _, Backbone, List, app.views);