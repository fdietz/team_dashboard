(function ($, _, Backbone, List, views, models, collections, helpers) {
  "use strict";

  views.JSONResponseEditor = Backbone.View.extend({

    events: {
      "click .btn-primary"        : "save",
      "click .cancel"             : "cancel",
      "click .test"               : "test"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "save", "cancel", "test");

      console.log(this.model);
      // this.source = options.source;
      // this.http_proxy_url = options.fields.http_proxy_url;
      // this.value_path = options.fields.value_path;
    },

    render: function() {
      var that = this;

      this.$el.html(window.JST['templates/widget/json_response_editor']());
      this.$modal = this.$el.find('.modal');

      this.$responsePreview = this.$("#response-preview");
      this.$result = this.$("#result");
      this.$valuePath = this.$("#value_path");
      this.$valuePath.val(this.model.get("fields").value_path);
      this.$valuePathControlGroup = this.$(".result");

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
      this.trigger("inputChanged", this.$valuePath.val());
      this.$modal.modal("hide");
      return false;
    },

    cancel: function() {
      this.$modal.modal("hide");
      return false;
    },

    test: function() {
      var that = this;

      this.model.get("fields").value_path = this.$valuePath.val();

      this.model.fetch().done(function(model) {
        that.$responsePreview.val(JSON.stringify(that.model.get("response_body")));
        that.$valuePathControlGroup.removeClass("success");
        that.$valuePathControlGroup.removeClass("error");
        if (_.isUndefined(that.model.get("value")) || _.isNull(that.model.get("value"))) {
          that.$result.val("No result found. Try a different value label!");
          that.$valuePathControlGroup.addClass("error");
        } else {
          that.$result.val(that.model.get("value"));
          that.$valuePathControlGroup.addClass("success");
        }
      });
      return false;
    },

    onClose: function() {
    }

  });
})($, _, Backbone, List, app.views, app.models, app.collections, app.helpers);
