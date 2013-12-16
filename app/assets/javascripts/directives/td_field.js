app.directive("tdField", ["$compile", function($compile) {
  return {
    replace: true,
    transclude: true,
    scope: {
      label: "@",
      help: "@"
    },
    template: '<div class="control-group" ng-class="errorClass()">' +
                '<label class="control-label" for="model">{{label}}</label>' +
                '<div class="controls">' +
                  '<div class="input-xlarge" ng-transclude>' +
                  '</div>' +
                  '<div ng-show="hasError()" class="help-block">{{helpText()}}</div>' +
                '</div>' +
              '</div>',
    link: function(scope, element, attrs) {
      var form = element.parent().controller("form");
      var transcludeParent = element.find("div[ng-transclude]");

      function name() {
        return transcludeParent.find("*[name]").attr("name");
      }

      scope.errorClass = function() {
        return scope.hasError() ? "error" : "";
      };

      scope.hasError = function() {
        return form[name()] && form[name()].$invalid && form[name()].$dirty;
      };

      var availableErrors = ["required", "minlength", "maxlength", "pattern"];
      var errorMessages = {
        "required": "Mandatory input field",
        "minlength": "Minimum length required",
        "maxlength": "Maximum length reached",
        "pattern": "Invalid input"
      };

      // TODO: refactor helpText
      scope.helpText = function() {
        if (scope.help) {
          return scope.help;
        } else {
          if (!form[name()]) return;
          
          var error = form[name()].$error;
          var result = [];

          _.each(error, function(value, key) {
            var match = _.find(availableErrors, function(ae) {
              if (key === ae) {
                return errorMessages[key];
              }
            });

            result.push(match ? match : key);
          });

          if (result) return result.join(", ");
        }
      };

    }
  };
}]);