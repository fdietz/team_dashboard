app.directive("fileInput", ["$window", "FileInputModel",  function($window, FileInputModel){

  var linkFn = function(scope, element, attrs, WidgetCtrl) {

    scope.showFileMessage = function() {
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
      return FileInputModel.getData(scope.widget).success(onSuccess);
    }

    scope.init(update);
  };

  return {
    template: $("#templates-widgets-file_input-show").html(),
    link: linkFn
  };
}]);
