(function ($, _, Backbone, views, models, collections) {
  "use strict";

  views.Widget = Backbone.View.extend({
    tagName: "div",
    className: "widget",

    events: {
      "click .widget-delete"   : "removeWidget",
      "click .widget-edit"     : "editWidget",
      "click .widget-collapse" : "collapseWidget"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "editWidget", "updateWidget", "renderWidget", "updateWidgetDone", "updateWidgetFail");

      this.model.on('change', this.render);

      this.dashboard = options.dashboard;

      this.startPolling = true;
    },

    updateWidget: function() {
      this.clearTimeout();
      if (this.startPolling === false) return;

      this.$ajaxSpinner.show();
      this.widget.update().done(this.updateWidgetDone).fail(this.updateWidgetFail);
    },

    updateWidgetDone: function() {
      console.log("updateWidgetDone")
      this.triggerTimeout();
      this.$ajaxSpinner.fadeOut('slow');
      // TODO clean up
      if (this.$content.find('.error')) this.renderWidget();
    },

    updateWidgetFail: function() {
      console.log("updateWidgetFail")
      this.triggerTimeout();
      this.$ajaxSpinner.hide();
      this.showLoadingError();
    },

    clearTimeout: function() {
      if (this.timerId) clearTimeout(this.timerId);
    },

    triggerTimeout: function() {
      this.timerId = setTimeout(this.updateWidget, this.model.get('update_interval') * 10000);
    },

    showLoadingError: function() {
      this.$content.html("<div class='error'><p>Error loading datapoints...</p></div>");
    },

    editWidget: function() {
      var dialog = null;
      switch(this.model.get('kind')) {
        case 'graph':
          dialog = new views.WidgetEditor.Graph({ model: this.model, dashboard: this.dashboard });
          break;
        case 'counter':
          dialog = new views.WidgetEditor.Counter({ model: this.model, dashboard: this.dashboard });
          break;
        case 'number':
          dialog = new views.WidgetEditor.Number({ model: this.model, dashboard: this.dashboard });
          break;
        case 'boolean':
          dialog = new views.WidgetEditor.Boolean({ model: this.model, dashboard: this.dashboard });
          break;
        default:
          throw("unknown widget kind: "+this.model.get('kind'));
      }
      var dialogElement = $(document.getElementById('widget-dialog'));

      dialogElement.html(dialog.render().el);
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
        case 'number':
          this.widget = new views.widgets.Number({ model: this.model });
          break;
        case 'boolean':
          this.widget = new views.widgets.Boolean({ model: this.model });
          break;
        default:
          throw("unknown widget kind: "+this.model.get('kind'));
      }
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
      this.close();

      var result = this.model.destroy();
    },

    collapseWidget: function(event) {
      this.$el.toggleClass("portlet-minimized");
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
