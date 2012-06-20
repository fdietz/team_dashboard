(function ($, _, Backbone, views, models, collections, router) {
  "use strict";

  views.Dashboard = Backbone.CompositeView.extend({
    events: {
      "click button.dashboard-delete"      : "removeDashboard",
      "click .add-graph"                   : "showGraphDialog",
      "click .add-counter"                 : "showCounterDialog"
    },

    initialize: function(options) {
      _.bindAll(this, "render", "_renderWidgets", "widgetChanged", "appendNewWidget", "removeWidget", "removeDashboard");

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

    _appendWidget: function(model) {
      var widget = new views.WidgetContainer({ model: model, dashboard: this.model});
      this.addChildView(widget);
      this.$container.append(widget.render().el);
    },

    _renderWidgets: function() {
      var that = this;
      // TODO: do we need this
      this.closeChildren();

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

      this._setup_editable_header();

      this.$container = this.$("#dashboard-widget-container");
      this.$container.empty();
      this._setup_sortable_widgets();
      this._renderWidgets();

      return this;
    },

    _setup_editable_header: function() {
      var that = this;
      this.$("h2#dashboard-name").editable(
        this.$('#dashboard-editable'), {
          success: function(value) {
            that.model.save({ name: value});
          }
      });
    },

    _setup_sortable_widgets: function() {
      var that = this;
      this.$container.sortable({
        forcePlaceholderSize: true, revert: 300, delay: 100, opacity: 0.8,
        stop: function (e,ui) {
          that._saveLayout();
        }
      });
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
      var dialog = new views.WidgetEditor.Graph({ model: widget, dashboard: this.model, widgetCollection: this.widgetCollection });
      this.$("#widget-dialog").html(dialog.render().el);
      return false;
    },

    showCounterDialog: function(event) {
      var widget = new models.Widget({ dashboard_id: this.model.id, kind: 'counter', source: $.Sources.first() });
      var dialog = new views.WidgetEditor.Counter({ model: widget, dashboard: this.model, widgetCollection: this.widgetCollection });
      this.$("#widget-dialog").html(dialog.render().el);
      return false;
    },

    onClose: function() {
      this.model.off();
      this.widgetCollection.off();
    }

  });

})($, _, Backbone, app.views, app.models, app.collections, app.router);
