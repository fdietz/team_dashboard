(function ($, _, Backbone, views, models, collections, router) {
  "use strict";

  views.Dashboard = Backbone.View.extend({
    events: {
      "click button.dashboard-delete"      : "removeDashboard",
      "click .add-graph"                   : "showGraphDialog",
      "click .add-counter"                 : "showCounterDialog"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "removeDashboard");

      this.model.on('change', this.render);
      this.model.on("widget:changed", this.widgetChanged);
    },

    render: function() {
      var that = this;

      $(this.el).html(JST['templates/dashboards/show']({ dashboard: this.model.toJSON() }));

      this._setup_editable_header();

      this.$container = this.$("#widget-container");
      this.widgetContainer = new views.WidgetContainer({ el: this.$container, model: this.model, collection: this.collection });
      this.widgetContainer.render();

      return this;
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
      var result = this.model.destroy({
        success: function(model, request) {
          window.app.router.navigate("/dashboards", { trigger: true });
        }
      });
    },

    showGraphDialog: function(event) {
      var widget = new models.Widget({ dashboard_id: this.model.id, kind: 'graph', source: $.Sources.first(), range: '30-minutes' });
      var dialog = new views.WidgetEditor.Graph({ model: widget, dashboard: this.model, widgetCollection: this.collection });
      this.$("#widget-dialog").html(dialog.render().el);
      return false;
    },

    showCounterDialog: function(event) {
      var widget = new models.Widget({ dashboard_id: this.model.id, kind: 'counter', source: $.Sources.first() });
      var dialog = new views.WidgetEditor.Counter({ model: widget, dashboard: this.model, widgetCollection: this.collection });
      this.$("#widget-dialog").html(dialog.render().el);
      return false;
    },

    onClose: function() {
      this.widgetContainer.close();

      this.model.off();
      this.collection.off();
    }

  });

})($, _, Backbone, app.views, app.models, app.collections, app.router);
