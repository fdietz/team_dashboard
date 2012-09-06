(function ($, _, Backbone, bootbox, views, models, collections, helpers) {
  "use strict";

  views.Widget = Backbone.View.extend({
    tagName: "div",
    className: "widget",

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

    triggerTimeout: function() {
      this.timerId = setTimeout(this.updateWidget, this.model.get('update_interval') * 1000);
    },

    showLoadingError: function(message) {
      var detailsStr  = "<p><a class='error-more-details' href='#''>More Details...</a></p>",
          messageStr  = "<p>Error loading datapoints:</p><p><strong>" + message + "</strong></p>",
          result      = null;

      result = "<div class='error'>"+ messageStr;
      if (this.errorResponse) {
        result += detailsStr;
      }
      result += "</div>";
      this.$content.html(result);
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
        .addClass("portlet well well-small ui-widget ui-widget-content ui-corner-all")
        .attr("id", "widget-span-" + this.model.get('size') || 1)
        .attr("data-widget-id", this.model.get("id"));

      this.$ajaxSpinner = this.$('.ajax-spinner');
      this.$content = this.$('.portlet-content');

      this.createWidget();
      this.updateWidget();

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

    createErrorTable: function(obj) {
      var table = document.createElement('table');
      var str = '<table class="table">';
      str += '<tr><th>NAME</th><th>VALUE</th></tr>';
      for (var prop in obj) {
        str += '<tr><td>' + prop + '</td><td>' + obj[prop] + '</td></tr>';
      }
      str += '</table>';
      return str;
    },

    showErrorMoreDetails: function(event) {
      var url     = "<h3>URL:&#160;&#160;<strong>" + this.errorResponse.url + "</strong></h3>",
          status = "<h3>Response Status:&#160;&#160;<strong>" + this.errorResponse.status + "</strong></h3>",
          headers = "<h4>Headers:</h4></br>" + this.createErrorTable(this.errorResponse.headers),
          text    = "<p>"+url+"</p><p>" + status + "</p><p>" + headers + "</p>";
      bootbox.alert(text);
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
