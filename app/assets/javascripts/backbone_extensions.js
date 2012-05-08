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
  }

})();