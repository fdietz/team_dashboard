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

  Backbone.CompositeView = Backbone.View.extend({

    constructor: function(){
      Backbone.View.prototype.constructor.apply(this, arguments);
      this.children = {};
    },

    forEachChild: function(callback) {
      _.each(this.children, function(view) {
        callback(view);
      });
    },

    addChildView: function(view) {
      this.children[view.cid] = view;
      this.$el.append(view.render().el);
    },

    removeChildView: function(view) {
      view.close();
      delete this.children[view.cid];
    },

    close: function() {
      this.closeChildren();
      Backbone.View.prototype.close.apply(this, arguments);
    },

    closeChildren: function() {
      var that = this;
      _.each(this.children, function(view) {
        that.removeChildView(view);
      });
    }
  });

})($, _, Backbone);
