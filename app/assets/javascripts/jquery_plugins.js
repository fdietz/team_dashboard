(function($) {
  "use strict";

  $.fn.editable = function(target, callback) {
    var label = $(this);
    var form = target;
    var input = form.find('> input');
    var currentValue = input.val();
    var that = this;

    return this.each(function() {

      var startEditing = function() {
        label.toggle();
        form.css("display", "inline");
        input.focus();
      };

      var stopEditing = function() {
        label.toggle();
        form.toggle();
      };

      label.on('click', function(event) {
        event.preventDefault();
        startEditing();
      });

      input.on('blur', function(event) {
        event.preventDefault();
        stopEditing();
        label.html(input.val());
        if (callback) callback(input.val());
      });

      form.on('submit', function(event) {
        event.preventDefault();
        stopEditing();
        label.html(input.val());
        if (callback) callback(input.val());
      });

      input.on('keyup', function(event) {
        if (event.keyCode == 27) {
          event.preventDefault();
          stopEditing();
          input.val(currentValue);
        }
      });
    });
  };

})($);