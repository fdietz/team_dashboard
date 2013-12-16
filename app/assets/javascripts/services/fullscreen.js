app.factory("Fullscreen", ["$rootScope", "$timeout", function($rootScope, $timeout) {

  var modalElement  = $('#fullscreen-notification');
  var navbarElement = $(".navbar");
  var timer;

  function hideNavbar() {
    navbarElement.slideUp("fast");
  }

  function showNavbar() {
    navbarElement.slideDown("fast");
  }

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
    $rootScope.$apply(hideNavbar);
    $rootScope.$apply(showModal);

    timer = $timeout(hideModal, 2000);
  };

  BigScreen.onexit = function() {
    $rootScope.$apply(showNavbar);
  };

  return {
    toggle: toggle
  };
}]);