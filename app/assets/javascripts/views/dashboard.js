(function ($, _, Backbone, views, models, collections, router, helpers) {
  "use strict";

  views.Dashboard = Backbone.View.extend({
    events: {
      "click button.dashboard-delete"      : "removeDashboard",

      "click .add-actions"                 : "showDialog",

      "click .widget-edit"                 : "editWidget"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "removeDashboard", "editWidget", "redraw");

      this.model.on('change', this.render);
      this.model.on("widget:changed", this.widgetChanged);
    },

    editWidget: function(event) {
      var widgetId = $(event.currentTarget).data("widget-id");
      var model = this.collection.get(widgetId);

      var className = this.toTitleCase(model.get('kind'));
      var editor = new views.WidgetEditors[className]({ model: model });
      var dialog = new views.WidgetEditor({ editor: editor, model: model, dashboard: this.model });
      var dialogElement = this.$('#widget-dialog');
      dialogElement.html(dialog.render().el);
      return false;
    },

    render: function() {
      var that = this;

      this.$el.html(JST['templates/dashboards/show']({ dashboard: this.model.toJSON() }));

      this._setup_editable_header();

      this.$container = this.$("#widget-container");
      this.widgetsContainer = new views.WidgetsContainer({ el: this.$container, model: this.model, collection: this.collection });
      this.widgetsContainer.render();

      // redraw the dashboard each hour (issue #12)
      this.timerId = setTimeout(this.redraw, 1000*60*60);

      return this;
    },

    redraw: function() {
      if (this.timerId) clearTimeout(this.timerId);
      window.location.href = "/dashboards/"+this.model.get("id");
    },

    _setup_editable_header: function() {
      var that = this;
      this.$("h2#dashboard-name").editable(
        this.$('#dashboard-editable'), function(value) {
          that.model.save({ name: value});
        }
      );
    },

    removeDashboard: function() {
      helpers.bootbox.animate(false);
      helpers.bootbox.confirm("Do you want to delete this dashboard?", "Cancel", "Delete", _.bind(function(result) {
        if (result) {
          this.model.destroy({
            success: function(model, request) {
              window.app.router.navigate("/dashboards", { trigger: true });
            }
          });
        }
      }, this));
    },

    toTitleCase: function(str) {
      return str.replace(/(?:^|\s)\w/g, function(match) {
          return match.toUpperCase();
      });
    },

    showDialog: function(event) {
      var kind = $(event.target).data("widget-kind");
      var className = this.toTitleCase(kind);

      var model = new models.Widget({ dashboard_id: this.model.id, kind: kind });
      var editor = new views.WidgetEditors[className]({ model: model });
      var dialog = new views.WidgetEditor({ editor: editor, model: model, dashboard: this.model, widgetCollection: this.collection });
      this.$("#widget-dialog").html(dialog.render().el);
      return false;
    },

    onClose: function() {
      this.widgetsContainer.close();

      this.model.off();
      this.collection.off();
    }

  });

})($, _, Backbone, app.views, app.models, app.collections, app.router, app.helpers);
