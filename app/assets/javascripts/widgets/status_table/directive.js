app.directive("statusTable", ["$window", "StatusTableModel",  function($window, StatusTableModel){

  var linkFn = function(scope, element, attrs, WidgetCtrl) {

    scope.showFileMessage = function() {
      var messages = scope.data.label;
	  var xyz = [];
	  for( var i=0, l=messages.length; i<l; i++ ) {
		xyz.push(messages[i].label, messages[i].value, '<br />');
	  }
	  var bootboxMessages = xyz.join(" ");
      $window.bootbox.animate(false);
      $window.bootbox.alert("<h2>"+bootboxMessages+"</h2>");
    };

    function onSuccess(data) {
      scope.data = data;
      scope.data.label = scope.data.label;
    }

    function update() {
      return StatusTableModel.getData(scope.widget).success(onSuccess);
    }

    scope.init(update);
  };

  return {
    templateUrl: "templates/widgets/status_table/show.html",
    link: linkFn
  };
}]);
