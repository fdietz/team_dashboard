app.directive("alert", ["$window", "AlertModel",  function($window, AlertModel){

  var linkFn = function(scope, element, attrs, WidgetCtrl) {

    scope.showAlertMessage = function() {
      var messages = scope.data.label;
      var bootboxMessages = messages.replace(/\n/g, '<br />');
      $window.bootbox.animate(false);
      $window.bootbox.alert("<h2>"+bootboxMessages+"</h2>");
    };

    function onSuccess(data) {
      scope.data = data;
      scope.data.label = scope.data.label;
    }

    function update() {
      return AlertModel.getData(scope.widget).success(onSuccess);
    }

    scope.init(update);
  };

  return {
    template: JST["templates/widgets/alert/show"],
    link: linkFn
  };
}]);