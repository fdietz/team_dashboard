app.factory("Fullscreen", ["$rootScope", "$timeout", function($rootScope, $timeout) {

  var modalElement  = $('#fullscreen-notification');
  var timer;

  function showModal() {
    modalElement.modal('show');
  }

  function hideModal() {
    modalElement.modal('hide');
    if (timer) $timeout.cancel(timer);
  }

  function toggle() {
    if (BigScreen.enabled) {
      BigScreen.toggle();
    }
  }

  BigScreen.onenter = function() {
    $rootScope.$apply(showModal);
    timer = $timeout(hideModal, 2000);
  };

  return {
    toggle: toggle
  };
}]);