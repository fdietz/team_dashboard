(function ($, _, Backbone, views, models, collections) {
  "use strict";

  views.WidgetContainer = Backbone.View.extend({
    tagName: "div",
    className: "widget",

    events: {
      "click .widget-delete"   : "removeWidget",
      "click .widget-edit"     : "editWidget",
      "click .widget-collapse" : "collapseWidget"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "updateWidget", "renderWidget", "updateWidgetDone", "updateWidgetFail");

      this.model.on('change', this.render);

      this.dashboard = options.dashboard;

      this.startPolling = true;
    },

    updateWidget: function() {
      console.log("updateWidget");
      if (this.timerId) clearTimeout(this.timerId);
      if (this.startPolling === false) return;

      this.$ajaxSpinner.show();
      this.widget.update().done(this.updateWidgetDone).fail(this.updateWidgetFail);
    },

    updateWidgetDone: function() {
      this.triggerTimeout();
      this.$ajaxSpinner.fadeOut('slow');
      console.log("error found", this.$content.find('.error'));
      if (this.$content.find('.error')) this.renderWidget();
    },

    updateWidgetFail: function() {
      this.triggerTimeout();
      this.$ajaxSpinner.hide();
      this.showLoadingError();
    },

    triggerTimeout: function() {
      this.timeoutId = setTimeout(this.updateWidget, this.model.get('update_interval') * 1000);
    },

    showLoadingError: function() {
      this.$content.html("<div class='error'><p>Error loading datapoints...</p></div>");
    },

    editWidget: function() {
      var dialog = null;
      switch(this.model.get('kind')) {
        case 'graph':
          dialog = new views.GraphDialog({ model: this.model, dashboard: this.dashboard });
          break;
        case 'counter':
          dialog = new views.CounterDialog({ model: this.model, dashboard: this.dashboard });
          break;
        default:
          alert("unknown widget kind: "+this.model.get('kind'));
      }

      $("#widget-dialog").html(dialog.render().el);
      return false;
    },

    createWidget: function() {
      switch(this.model.get('kind')) {
        case 'graph':
          this.widget = new views.widgets.Graph({ model: this.model });
          break;
        case 'counter':
          this.widget = new views.widgets.Counter({ model: this.model });
          break;
        default:
          alert("unknown widget kind: "+this.model.get('kind'));
      }
      this.$content.html(this.widget.render().el);
    },

    renderWidget: function() {
      this.$content.html(this.widget.el);
    },

    render: function() {
      console.log("render widget container", this.model.get('name'));

      $(this.el).html(JST['templates/widget_container/show']({ widget: this.model.toJSON() }));

      $(this.el)
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
      this.close();

      var result = this.model.destroy({
        success: function(model, request) {
          console.log("deleted model: ", model);
        }
      });
    },

    collapseWidget: function(event) {
      $(this.el).toggleClass("portlet-minimized");
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

})($, _, Backbone, app.views, app.models, app.collections);
