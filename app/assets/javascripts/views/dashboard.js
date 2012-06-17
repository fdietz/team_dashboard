(function ($, _, Backbone, views, models, collections, router) {
  "use strict";

  views.Dashboard = Backbone.View.extend({
    events: {
      "click button.dashboard-delete"      : "removeDashboard",
      "click .add-graph"              : "showGraphDialog",
      "click .add-counter"                 : "showCounterDialog"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "saveLayout", "appendWidget", "renderWidgets", "closeAllWidgets", "widgetsChanged");

      this.model.on('reset', this.render);
      this.model.on('change', this.render);
      this.model.on("widgets:changed", this.widgetsChanged);

      this.widgets = [];
    },

    widgetsChanged: function() {
      this.model.fetch();
    },

    closeAllWidgets: function() {
      _.each(this.widgets, function(widget) {
        widget.close();
        widget = null;
      });

      this.widgets = [];
    },

    appendWidget: function(model) {
      var widget = new views.WidgetContainer({ model: model, dashboard: this.model});
      this.widgets.push(widget);
      this.container.append(widget.render().el);
    },

    renderWidgets: function() {
      var that = this;
      this.closeAllWidgets();

      var widgetCollection = new collections.Widget({ dashboard_id: this.model.id });
      widgetCollection.fetch({
        success: function(collection, request) {
          var layoutIds = that.model.get('layout');
          _.each(layoutIds, function(id, index) {
            var model = collection.get(id);
            that.appendWidget(model);
          });

        }
      });
    },

    render: function() {
      var that = this;

      $(this.el).html(JST['templates/dashboards/show']({ dashboard: this.model.toJSON() }));

      this.container = this.$("#dashboard-widget-container");

      this.$("h2#dashboard-name").editable(
        this.$('#dashboard-editable'), {
          success: function(value) {
            that.model.save({ name: value});
          }
      });

      this.container.sortable({
        forcePlaceholderSize: true, revert: 300, delay: 100, opacity: 0.8,
        stop:  function (e,ui) { that.saveLayout(); }
      });

      this.container.empty();
      this.renderWidgets();

      return this;
    },

    currentLayout: function() {
      var ids = [];
      this.$('.widget').each(function(index) {
        ids.push($(this).attr('data-widget-id'));
      });
      return ids;
    },

    saveLayout: function() {
      this.model.save({ layout: this.currentLayout() }, {
        success: function(model, request) {
          console.log("saved layout", model);
        }
      });
    },

    removeDashboard: function() {
      var result = this.model.destroy({
        success: function(model, request) {
          console.log("destroyed model: ", model);
          window.app.router.navigate("/dashboards", { trigger: true });
        }
      });
    },

    showGraphDialog: function(event) {
      var widget = new models.Widget({ dashboard_id: this.model.id, kind: 'graph', source: $.Sources.first() });
      var dialog = new views.GraphDialog({ model: widget, dashboard: this.model });
      this.$("#widget-dialog").html(dialog.render().el);
      return false;
    },

    showCounterDialog: function(event) {
      var widget = new models.Widget({ dashboard_id: this.model.id, kind: 'counter', source: $.Sources.first() });
      var dialog = new views.CounterDialog({ model: widget, dashboard: this.model });
      this.$("#widget-dialog").html(dialog.render().el);
      return false;
    },

    onClose: function() {
      this.model.off('reset', this.render);
      this.model.off('change', this.render);
      this.model.off("widgets:changed", this.render);

      this.closeAllWidgets();
    }

  });

})($, _, Backbone, app.views, app.models, app.collections, app.router);
