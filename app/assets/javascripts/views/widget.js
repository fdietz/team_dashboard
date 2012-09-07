(function ($, _, Backbone, bootbox, views, models, collections, helpers) {
  "use strict";

  views.Widget = Backbone.View.extend({
    tagName: "div",
    className: "widget portlet well well-small ui-widget ui-widget-content ui-corner-all",

    events: {
      "click .widget-delete"      : "removeWidget",
      "click .error-more-details" : "showErrorMoreDetails"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "updateWidget", "renderWidget", "updateWidgetDone", "updateWidgetFail", "showErrorMoreDetails");

      this.model.on('change', this.render);

      this.dashboard = options.dashboard;
      this.dialogEl = options.dialogEl;

      this.startPolling = true;
    },

    updateWidget: function() {
      this.clearTimeout();
      if (this.startPolling === false) return;

      this.$ajaxSpinner.show();
      this.widget.update().done(this.updateWidgetDone).fail(this.updateWidgetFail);
    },

    updateWidgetDone: function() {
      this.triggerTimeout();
      this.$ajaxSpinner.fadeOut('slow');
      // TODO clean up
      if (this.$content.find('.error')) this.renderWidget();
    },

    updateWidgetFail: function(xhr, status, statusText) {
      var message = null;
      if (xhr.status === 0) {
        message = "Could not connect to rails app";
      } else if (xhr.responseText.length > 0){
        var responseText = JSON.parse(xhr.responseText);
        message  = responseText.message;
        this.errorResponse = responseText.response;
      } else {
        message = statusText;
      }
      this.triggerTimeout();
      this.$ajaxSpinner.hide();
      this.showLoadingError(message);
    },

    clearTimeout: function() {
      if (this.timerId) clearTimeout(this.timerId);
    },

    triggerTimeout: function(interval) {
      this.timerId = setTimeout(this.updateWidget, interval || this.model.get('update_interval') * 1000);
    },

    toTitleCase: function(str) {
      return str.replace(/(?:^|\s)\w/g, function(match) {
          return match.toUpperCase();
      });
    },

    createWidget: function() {
      var className = this.toTitleCase(this.model.get('kind'));
      this.widget = new views.widgets[className]({ model: this.model });
      this.$content.html(this.widget.render().el);
    },

    renderWidget: function() {
      this.$content.html(this.widget.el);
    },

    render: function() {
      this.$el.html(JST['templates/widget/show']({ widget: this.model.toJSON() }));

      this.$el
        .attr("id", "widget-span-" + this.model.get('size'))
        .attr("data-widget-id", this.model.get("id"));

      this.$ajaxSpinner = this.$('.ajax-spinner');
      this.$content = this.$('.portlet-content');

      this.createWidget();
      this.triggerTimeout(1);

      return this;
    },

    removeWidget: function(event) {
      var that = this;
      helpers.bootbox.animate(false);
      helpers.bootbox.confirm("Do you want to delete the <strong>" + this.model.get("name") + "</strong> widget?", "Cancel", "Delete", function(result) {
        if (result) {
          that.close();
          that.model.destroy();
        }
      });
    },

    showLoadingError: function(message) {
      var html = JST['templates/widget/loading_error']({ message: message, errorResponse: this.errorResponse });
      this.$content.html(html);
    },

    showErrorMoreDetails: function(event) {
      var headers = [];
      for (var prop in this.errorResponse.headers) {
        headers.push({ name: prop, value: this.errorResponse.headers[prop]});
      }

      var html = JST['templates/widget/request_error_dialog']({ url: this.errorResponse.url, status: this.errorResponse.status, headers: headers });
      bootbox.alert(html);

      return false;
    },

    onClose: function() {
      this.startPolling = false;
      this.model.off();
      this.clearTimeouts();
      this.widget.close();
    },

    clearTimeouts: function() {
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
    }

  });

})($, _, Backbone, bootbox, app.views, app.models, app.collections, app.helpers);
