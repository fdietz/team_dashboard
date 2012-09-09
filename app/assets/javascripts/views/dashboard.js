(function ($, _, Backbone, views, models, collections, router, helpers) {
  "use strict";

  var Toolbar = Backbone.View.extend({

    events: {
      "click button.dashboard-toggle-lock" : "toggleLock"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "toggleLock");
      this.model.on('change:locked', this.render);
    },

    toggleLock: function() {
      this.model.toggleLock();
      return false;
    },

    render: function() {
      this.$el.html(JST["templates/dashboards/toolbar"]({ model: this.model.toJSON() }));
      return this;
    }

  });

  views.Dashboard = Backbone.View.extend({
    events: {
      "click .widget-edit"                 : "editWidget",
      "click .add-actions"                 : "showDialog",
      "click button.dashboard-delete"      : "removeDashboard"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "editWidget", "redraw", "removeDashboard");
    },

    _setup_editable_header: function() {
      var that = this;
      this.$("h2#heading").on("keydown", function(event) {
        var esc  = event.which == 27,
            nl   = event.which == 13,
            $el  = $(event.target);

        if (esc) {
          $el.blur();
        } else if (nl) {
          $el.blur();
          that.model.save({ name: $el.text() });
        }
      });
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

      this.toolbar = new Toolbar({ model: this.model });
      this.$("#toolbar").html(this.toolbar.render().el);

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
