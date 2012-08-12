(function($) {
  "use strict";

  var selectableMethods = {
    init : function(options) {
      var defaults = {};
      options = $.extend(defaults, options);

      return this.each(function() {
        var $result = $(this);
        var $container = null;

        $result.hide();

        cleanupControls();
        createControls();

        var $input     = $result.parent().find(".selectable-input"),
            $list      = $result.parent().find(".selectable-list"),
            $remove    = $result.parent().find(".remove"),
            $add       = $result.parent().find(".add");

        $input.typeahead({ source: options.source });

        populate();

        function cleanupControls() {
          $result.parent().find(".selectable-container").remove();
        }

        function createControls() {
          var input       = "<input class='selectable-input' type='text' size='16'></input>",
              button      = "<button class='btn add' type='button'>Add</button>",
              inputAppend = "<div class='input-append'>" + input + button + "</div>",
              list        = "<ul class='selectable-list input-large'></ul>",
              container   = "<div class='selectable-container'>" + inputAppend + list + "</div>";
          $container = $(container);
          $result.after($container);
        }

        function populate() {
          var values = $result.val().split(",");
          $list.empty();
          $.each(values, function(i, n) {
            if (n.length > 0) {
              addItemToList($.trim(n));
            }
          });
        }

        function addItem() {
          var value = $input.val();
          addItemToList(value);
          updateResult();
          $input.val("");
        }

        function addItemToList(value) {
          var icon = "<span class='remove icon-minus-sign'></span>",
              text = "<span class='text'>"+ value + "</span>",
              li   = "<li title="+ value + ">"+ text + icon +"</li>";
          $list.append($(li));
        }

        function updateResult() {
          var listValues = $list.find("li>span.text").map(function(i, n) {
              return $(n).clone().children().remove().end().text();
          }).get().join(",");
          $result.val(listValues);
        }

        function handleKeyboardAdd(event) {
          if (event.keyCode == 13 && $input.val().length > 0) {
            addItem();
          }
        }

        function handleRemove(event) {
          var $li = $(event.currentTarget).closest("li");
          $li.remove();
          updateResult();
        }

        function handleButtonAdd(event) {
          if ($input.val().length > 0) {
            addItem();
          }
        }

        $input.keyup(handleKeyboardAdd);
        $result.parent().on("click", "li > .remove", handleRemove);
        $add.on("click", handleButtonAdd);

      });
    },

    disable : function() {
      var $result = $(this);

      var $input = $(".selectable-input");
      var $list  = $(".selectable-list");
      $input.remove();
      $list.remove();
      $result.show();
    }
  };

  $.fn.selectable = function(method) {
    if ( selectableMethods[method] ) {
      return selectableMethods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return selectableMethods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }
  };

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