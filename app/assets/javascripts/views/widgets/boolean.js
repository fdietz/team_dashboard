(function ($, _, Backbone, views, models, collections){
  "use strict";

  var BooleanSubview = Backbone.View.extend({

    className: 'triple-row',

    initialize: function(options) {
      _.bindAll(this, "render");
      this.widget = options.widget;
      this.number = options.number;
      this.updateModel();
    },

    fetch: function() {
      return this.model ? this.model.fetch() : null;
    },

    updateModel: function() {
      if (this.getSource()) {
        if (this.model) {
          this.model.off();
        }
        this.model = new models.Boolean({ source: this.getSource(), http_proxy_url: this.getHttpProxyUrl(), value_path: this.getValuePath() });
        this.model.on('change', this.render);
      }
    },

    getHttpProxyUrl: function() {
      return this.widget.get("http_proxy_url" + this.number);
    },

    getValuePath: function() {
      return this.widget.get("value_path" + this.number);
    },

    getSource: function() {
      return this.widget.get("source" + this.number);
    },

    getLabel: function() {
      return this.model.get("label") || this.widget.get("label" + this.number);
    },

    getValue: function() {
      var result = this.model.resolveValue();
      return result;
    },

    render: function() {
      if (this.model) {
        this.$el.html(JST['templates/widgets/boolean/subview']({ label: this.getLabel() }));

        this.$value = this.$('.boolean-value');
        this.$value.toggleClass('green', this.getValue() === true);
        this.$value.toggleClass('red', this.getValue() === false);
      }

      return this;
    },

    onClose: function() {
      if (this.model) this.model.off();
    }

  });

  views.widgets.Boolean = Backbone.CompositeView.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "update", "widgetChanged");
      this.updateBooleanModels();
      this.model.on('change', this.widgetChanged);
    },

    updateBooleanModels: function() {
      this.forEachChild(function(child) {
        child.updateModel();
      });
    },

    widgetChanged: function() {
      this.updateBooleanModels();
      this.render();
    },

    render: function() {
      this.booleanView1 = new BooleanSubview({ widget: this.model, number: 1 });
      this.addChildView(this.booleanView1);

      this.booleanView2 = new BooleanSubview({ widget: this.model, number: 2 });
      this.addChildView(this.booleanView2);

      this.booleanView3 = new BooleanSubview({ widget: this.model, number: 3 });
      this.addChildView(this.booleanView3);

      return this;
    },

    update: function() {
      var that = this;
      var options = { suppressErrors: true };
      var validModels = [];
      this.forEachChild(function(child) {
        validModels.push(child.fetch());
      });
      return $.when.apply(null, validModels);
    },

    onClose: function() {
      this.model.off();
    }
  });

})($, _, Backbone, app.views, app.models, app.collections);
