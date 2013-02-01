(function ($, _, Backbone, bootbox, views, models, collections, helpers) {
  "use strict";

  views.Widget = Backbone.View.extend({
    tagName: "div",
    className: "widget portlet well well-small ui-widget ui-widget-content ui-corner-all",

    events: {
      "click .error-more-details" : "showErrorMoreDetails",
      "click .widget-delete"      : "removeWidget"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "updateWidget", "renderWidget", "updateWidgetDone", "updateWidgetFail", "showErrorMoreDetails", "toggledFullscreen", "removeWidget");

      this.model.on('change', this.render);

      this.dashboard = options.dashboard;
      this.dialogEl = options.dialogEl;

      this.startPolling = true;

      this.dashboard.on("change:fullscreen", this.toggledFullscreen);
    },

    removeWidget: function(event) {
      var that = this;

      helpers.bootbox.animate(false);
      helpers.bootbox.confirm("Do you want to delete the <strong>" + this.model.get("name") + "</strong> widget?", "Cancel", "Delete", function(result) {
        if (result) {
          that.close();
          that.model.destroy();
          that.dashboard.trigger("change:layout");
        }
      });
    },

    // TODO: consider creating a separate Backbone View and just render that on change:fullscreen event
    toggledFullscreen: function() {
      if (this.dashboard.isFullscreen()) {
        this.$widgetDeleteButton.hide();
        this.$widgetEditButton.hide();
      } else {
        this.$widgetDeleteButton.show();
        this.$widgetEditButton.show();
      }
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

      this.renderWidget();
    },

    updateWidgetFail: function(xhr, status, statusText) {
      this.previousStateWasError = true;

      this.parseError(xhr, statusText);
      this.triggerTimeout();
      this.$ajaxSpinner.hide();
      this.renderLoadingError();
    },

    parseError: function(xhr, statusText) {
      this.message = null;
      this.errorResponse = null;

      if (xhr.status === 0) {
        this.message = "Could not connect to rails app";
      } else if (xhr.responseText.length > 0){
        var responseText = JSON.parse(xhr.responseText);
        this.message  = responseText.message;
        this.errorResponse = responseText.response;
      } else {
        this.message = statusText;
      }
    },

    clearTimeout: function() {
      if (this.timerId) clearTimeout(this.timerId);
    },

    triggerTimeout: function(interval) {
      this.timerId = setTimeout(this.updateWidget, interval || this.model.get('update_interval') * 1000);
    },

    toCamelCase: function(str) {
      return str.replace(/(?:^|[\s_])\w/g, function(match) {
          return match.toUpperCase();
      }).replace(/\s|_/g,'');
    },

    createWidget: function() {
      var className = this.toCamelCase(this.model.get('kind'));
      // temporary hardcode graph renderer
      if (className === "Graph") {
        // className = "RickshawGraph";
        className = "Flotr2Graph";
      }

      this.widget = new views.widgets[className]({ model: this.model });
      this.$widgetContent.html(this.widget.render().el);
    },

    renderWidget: function() {
      if (this.previousStateWasError) {
        this.$errorContent.hide();
        this.$widgetContent.show();
      }
    },

    renderLoadingError: function() {
      var html = JST['templates/widget/loading_error']({ message: this.message, errorResponse: this.errorResponse });
      this.$widgetContent.hide();
      this.$errorContent.html(html);
      this.$errorContent.show();
    },

    render: function() {
      this.$el.html(JST['templates/widget/show']({ widget: this.model.toJSON() }));

      this.$el
        .attr("id", "widget-span-" + this.model.get('size'))
        .attr("data-widget-id", this.model.get("id"));

      this.$ajaxSpinner = this.$('.ajax-spinner');
      this.$widgetContent = this.$(".widget-content");
      this.$errorContent = this.$(".error-content");
      this.$widgetDeleteButton = this.$(".widget-delete");
      this.$widgetEditButton = this.$(".widget-edit");

      this.toggledFullscreen();

      this.createWidget();

      this.triggerTimeout(1);

      return this;
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
