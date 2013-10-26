app.directive("gridster", ["Widget", "DASHBOARD_COLUMN_COUNT", function(Widget, DASHBOARD_COLUMN_COUNT) {

  function controllerFn($scope, $element, $attrs) {
    var gridster = null;
    var draggable = {
      stop: function(event, ui) {
        saveLayout();
      }
    };
    var options = {
      widget_margins: [8, 8],
      widget_base_dimensions: [320, 150],
      min_cols: DASHBOARD_COLUMN_COUNT || 4,
      avoid_overlapped_widgets: true,
      serialize_params: serializeParamsFn,
      draggable: draggable
    };

    function serializeParamsFn($w, wgd) {
      return {
        col: wgd.col,
        row: wgd.row,
        size_x: wgd.size_x,
        size_y: wgd.size_y,
        id: $w.find("div").data("id")
      };
    }

    function getWidget(id) {
      return _.find($scope.widgets, function(w) {
        return w.id === id;
      });
    }

    function saveLayout() {
      var layouts = gridster.serialize_changed();

      angular.forEach(layouts, function(layout) {
        var w = getWidget(layout.id);
        w.col = layout.col;
        w.row = layout.row;
        w.size_x = layout.size_x;
        w.size_y = layout.size_y;
        w.$update();
      });
    }

    return {
      init: function(element) {
        var ul = $element.find("ul");
        gridster = ul.gridster(options).data("gridster");
      },
      add: function(elm, options) {
        // ensure col and row are set for new widgets
        var pos = gridster.next_position(options.size_x, options.size_y);
        if (!options.col && !options.row) { options = _.extend(options, pos); }

        gridster.add_widget(elm, options.size_x, options.size_y, options.col, options.row);
      },
      remove: function(elm) {
        gridster.remove_widget(elm);
      },
      resize: function(elm, size_x, size_y) {
        gridster.resize_widget(elm, size_x, size_y);
      }
    };
  }

  return {
    restrict: "E",
    transclude: true,
    replace: true,
    template: '<div class="gridster"><div ng-transclude/></div>',
    controller: controllerFn,
    link: function(scope, element, attrs, controller) {
      controller.init(element);
    }
  };
}]);