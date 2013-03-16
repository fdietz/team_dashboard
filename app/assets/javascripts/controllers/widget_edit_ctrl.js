app.controller("WidgetEditCtrl", ["$scope", "$compile", "dialog", "$dialog", "Widget", "EditorFormOptions", "Sources", function($scope, $compile, dialog, $dialog, Widget, EditorFormOptions, Sources) {

  function initWidget() {
    var defaults = {
      row: null, col: null,
      kind: dialog.kind,
      dashboard_id: dialog.dashboard.id
    };

    var widget = null;
    if (dialog.widget) {
      widget = angular.copy(dialog.widget);
    } else {
      widget = new Widget(defaults);
    }

    $scope.template = dialog.editTemplate;
    $scope.customFieldsTemplate = dialog.customFieldsTemplate;

    return widget;
  }

  $scope.widget               = initWidget();
  $scope.updateIntervals      = EditorFormOptions.updateIntervals;
  $scope.periods              = EditorFormOptions.periods;
  $scope.sizes                = EditorFormOptions.sizes;
  $scope.sources              = Sources.availableSources($scope.widget.kind);

  function setValidity(field, error) {
    $scope.form[field].$dirty = true;
    $scope.form[field].$setValidity(error, false);
  }

  function handleValidationErrors(response) {
    console.log("create error", response);

    _.each(response.data, function(errors, key) {
      _.each(errors, function(e) {
        setValidity(key, e);
      });
    });
  }

  function handleSuccess(data) {
    dialog.close(true);
  }

  $scope.save = function(widget) {
    if ($scope.form.$invalid) return;

    if (widget.id) {
      widget.$update(handleSuccess, handleValidationErrors);
    } else {
      widget.$create(handleSuccess, handleValidationErrors);
    }
  };

  $scope.isSaveDisabled = function() {
    return $scope.form.$invalid;
  };

  $scope.cancel = function(widget) {
    dialog.close(false);
  };

}]);