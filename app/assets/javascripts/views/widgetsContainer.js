(function ($, _, Backbone, views, models, collections) {
  "use strict";

  views.WidgetsContainer = Backbone.CompositeView.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "_appendAllWidgets", "widgetChanged", "appendNewWidget", "removeWidget");

      this.collection.on('add', this.appendNewWidget);
      this.collection.on('remove', this.removeWidget);
    },

    render: function() {
      this.setupSortableWidgets();

      // TODO: do we need this
      this.closeChildren();
      this._appendAllWidgets();

      return this;
    },

    setupSortableWidgets: function() {
      var that = this;
      this.$el.sortable({
        forcePlaceholderSize: true, forceHelperSize: true, revert: 300, delay: 100, opacity: 0.8, handle: '.portlet-header',
        tolerance: 'pointer',
        stop: function (e,ui) {
          that._saveLayout();
        },
        start: function (event, block) {
          // set placeholder size to the widget size
          that.$('.ui-sortable-placeholder').css({
              'width': that.$(block.helper).outerWidth(),
              'height': that.$(block.helper).outerHeight()
          });
        }
      });
    },

    _appendWidget: function(model) {
      var widget = new views.Widget({ model: model, dashboard: this.model});
      this.addChildView(widget);
      this.$el.append(widget.render().el);
    },

    _appendAllWidgets: function() {
      var layoutIds = this.model.get('layout');
      _.each(layoutIds, _.bind(function(id, index) {
        var model = this.collection.get(id);
        if (model) this._appendWidget(model);
      }, this));
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

    appendNewWidget: function(widget) {
      this._appendWidget(widget);
    },

    removeWidget: function(widget) {
    },

    widgetChanged: function(widget) {
    },

    onClose: function() {
      this.collection.off();
    }

  });

})($, _, Backbone, app.views, app.models, app.collections);
