(function ($, _, Backbone, views, models, collections, router) {
  "use strict";

  views.Dashboard = Backbone.View.extend({
    events: {
      "click button.dashboard-delete"      : "removeDashboard",
      "click .add-graph"                   : "showGraphDialog",
      "click .add-counter"                 : "showCounterDialog"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "_saveLayout", "_renderWidgets", "_closeAllWidgets", "widgetChanged", "appendNewWidget", "removeWidget", "removeDashboard");

      this.model.on('change', this.render);
      this.model.on("widget:changed", this.widgetChanged);

      this.widgetCollection = new collections.Widget({ dashboard_id: this.model.id });
      this.widgetCollection.on('add', this.appendNewWidget);
      this.widgetCollection.on('remove', this.removeWidget);
    },

    appendNewWidget: function(widget) {
      this._appendWidget(widget);
    },

    removeWidget: function(widget) {
    },

    widgetChanged: function(widget) {
    },

    _closeAllWidgets: function() {
      if (this.widgetCollection.isFetched === false) return;

      this.widgetCollection.each(function(widget) {
        widget.close();
      });
    },

    _appendWidget: function(model) {
      var widget = new views.WidgetContainer({ model: model, dashboard: this.model});
      this.container.append(widget.render().el);
    },

    _renderWidgets: function() {
      var that = this;
      this._closeAllWidgets();

      this.widgetCollection.fetch({
        success: function(collection, request) {
          var layoutIds = that.model.get('layout');
          _.each(layoutIds, function(id, index) {
            var model = collection.get(id);
            if (model) that._appendWidget(model);
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
        stop:  function (e,ui) { that._saveLayout(); }
      });

      this.container.empty();
      this._renderWidgets();

      return this;
    },

    _currentLayout: function() {
      var ids = [];
      this.$('.widget').each(function(index) {
        ids.push($(this).attr('data-widget-id'));
      });
      return ids;
    },

    _saveLayout: function() {
      this.model.save({ layout: this._currentLayout() }, {
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
      var widget = new models.Widget({ dashboard_id: this.model.id, kind: 'graph', source: $.Sources.first(), range: '30-minutes' });
      var dialog = new views.GraphDialog({ model: widget, dashboard: this.model, widgetCollection: this.widgetCollection });
      this.$("#widget-dialog").html(dialog.render().el);
      return false;
    },

    showCounterDialog: function(event) {
      var widget = new models.Widget({ dashboard_id: this.model.id, kind: 'counter', source: $.Sources.first() });
      var dialog = new views.CounterDialog({ model: widget, dashboard: this.model, widgetCollection: this.widgetCollection });
      this.$("#widget-dialog").html(dialog.render().el);
      return false;
    },

    onClose: function() {
      this.model.off();
      this.widgetCollection.off();
      this._closeAllWidgets();
    }

  });

})($, _, Backbone, app.views, app.models, app.collections, app.router);
