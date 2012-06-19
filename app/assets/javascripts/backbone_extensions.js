(function($, _, Backbone) {
  "use strict";

  // support cleanup of backbone views via a close method
  // and a onClose method for views to implement
  // use onClose for unbinding model/collection events
  Backbone.View.prototype.close = function(){
    this.remove();

    if (this.onClose) this.onClose();
    this.off();
    if (this.model) this.model.off();
    if (this.collection) this.collection.off();
  };

  // simple form helper, html follows Rails conventions
  _.extend(Backbone.View.prototype, {
    parse: function(objName) {
      var self = this;
      var _recurse_form = function(object, objName) {
        _.each(object, function(v,k) {
          if (v instanceof Object) {
            object[k] = _recurse_form(v, objName + '[' + k + '_attributes]');
          } else {
            var element = self.$('[name="'+ objName + '[' + k + ']"]');
            if (element.length > 0) {
              object[k] = element.val();
            }
          }
        });
        return object;
      };
      return _recurse_form(this.model.attributes, objName);
    },

    populate: function(objName) {
      var self = this,
        _recurse_obj = function(object, objName) {
          _.each(object, function (v,k) {
             if (v instanceof Object) {
                _recurse_obj(v, objName + '[' + k + '_attributes]');
             } else if (_.isString(v)) {
                self.$('[name="' + objName + '[' + k + ']"]').val(v);
             }
          });
        };
      _recurse_obj(this.model.attributes, objName);
    }
  });

  Backbone.CompositeView = Backbone.View.extend({
    constructor: function(){
      Backbone.View.prototype.constructor.apply(this, arguments);
      this.children = {};
    },

    addView: function(view) {
      this.children[view.cid] = view;
    },

    removeView: function(view) {
      view.close();
      delete this.children[view.cid];
    },

    close: function() {
      this.closeChildren();
      Backbone.View.prototype.close.apply(this, arguments);
    },

    closeChildren: function() {
      var that = this;
      _.each(this.children, function(view){
        that.removeView(view);
      });
    }
  });

})($, _, Backbone);
