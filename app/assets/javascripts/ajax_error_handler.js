(function($, _, Backbone) {
  "use strict";

  $(document).ajaxError(function(error, xhr, settings, exception) {
    if (settings.suppressErrors) {
        return;
    }

    var message = null;
    if (xhr.status === 0) {
      message = "The server could not be contacted.";
    } else if (xhr.status == 403) {
      message = "Login is required for this action.";
    } else if (500 <= xhr.status <= 600) {
      message = "There was an error on the server.";
    }
    var errorsView = new app.views.Errors({ message: message });
    $('#flash').html(errorsView.render().el);
  });

})($, _, Backbone);
