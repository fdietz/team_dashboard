(function() {

  // support cleanup of backbone views via a close method
  // and a onClose method for views to implement
  // use onClose for unbinding model/collection events
  Backbone.View.prototype.close = function(){
    this.remove();
    this.unbind();

    if (this.onClose) {
      this.onClose();
    }
  };

  $(document).ajaxError(function(error, xhr, settings, exception) {
    if (settings.suppressErrors) {
        return;
    }

    console.log(xhr.status, xhr.responseText, "exception: " + exception);
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

})();