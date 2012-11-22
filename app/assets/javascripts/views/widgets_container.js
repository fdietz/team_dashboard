(function ($, _, Backbone, views, models, collections, helpers) {
  "use strict";

  views.WidgetsContainer = Backbone.CompositeView.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "_appendAllWidgets", "widgetChanged", "appendNewWidget", "removeWidget", "toggledLock", "saveLayout");

      this.collection.on('add', this.appendNewWidget);
      this.collection.on('remove', this.removeWidget);

      this.model.on("change:locked", this.toggledLock);
      this.model.on("change:layout", this.saveLayout);
    },

    toggledLock: function() {
      if (this.model.isLocked()) {
        this.$el.sortable("disable");
      } else {
        this.setupSortableWidgets();
      }
    },

    render: function() {
      this.setupSortableWidgets();

      // TODO: do we need this
      this.closeChildren();
      this._appendAllWidgets();

      this.toggledLock();

      return this;
    },

    setupSortableWidgets: function() {
      var that = this;
      this.$el.sortable({
        forcePlaceholderSize: true, forceHelperSize: true, revert: 300, delay: 100, opacity: 0.8, handle: '.portlet-header',
        tolerance: 'pointer',
        stop: function (e,ui) {
          that.saveLayout();
        },
        start: function (event, block) {
          // set placeholder size to the widget size
          that.$('.ui-sortable-placeholder').css({
              'width': that.$(block.helper).width(),
              'height': that.$(block.helper).height()
          });
        }
      });
    },

    _appendWidget: function(model) {
      var widget = new views.Widget({ model: model, dashboard: this.model});
      this.addChildView(widget);
    },

    _appendAllWidgets: function() {
      var that = this;
      var layoutIds = this.model.get('layout');
      if (layoutIds.length === 0) {
        this.collection.each(function(w) {
          layoutIds.push(w.id);
        });
      }

      _.each(layoutIds, _.bind(function(id, index) {
        var model = this.collection.get(id);
        if (model) this._appendWidget(model);
      }, this));
    },

    currentLayout: function() {
      var ids = [];
      this.$('.widget').each(function(index) {
        ids.push($(this).attr('data-widget-id'));
      });
      return ids;
    },

    saveLayout: function() {
      this.model.save({ layout: this.currentLayout() }, { silent: true });
    },

    appendNewWidget: function(widget) {
      this._appendWidget(widget);
      this.saveLayout();
    },

    removeWidget: function(widget) {
      this.saveLayout();
    },

    widgetChanged: function(widget) {
    },

    onClose: function() {
      this.collection.off();
    }

  });

})($, _, Backbone, app.views, app.models, app.collections, app.helpers);
