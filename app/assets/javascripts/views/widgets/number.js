(function ($, _, Backbone, views, models, collections, helpers){
  "use strict";

  var NumberSubview = Backbone.View.extend({

    className: 'triple-row',

    initialize: function(options) {
      _.bindAll(this, "render");
      this.widget = options.widget;
      this.number = options.number;
      this.updateModel();
    },

    fetch: function() {
      return this.model ? this.model.fetch({ suppressErrors: true }) : null;
    },

    updateModel: function() {
      var that = this;

      if (this.getSource()) {
        if (this.model) {
          this.model.off();
        }
        var options = { source: this.getSource() };
        var fields = {};
        var plugin = _.find($.Sources.number, function(plugin) {
          return that.getSource() === plugin.name;
        });

        if (plugin) {
          _.each(plugin.fields, function(field) {
            fields[field.name] = that.widget.get(plugin.name + "-" + field.name + that.number);
          });
        }

        this.model = new models.Number(_.extend(options, { fields: fields } ));
        this.model.on('change', this.render);
      }
    },

    getSource: function() {
      return this.widget.get("source" + this.number);
    },

    getValue: function() {
      return this.model.get("value") || 0;
    },

    getValueAsString: function(value) {
      return helpers.suffixFormatter(value, 1);
    },

    getLabel: function() {
      return this.model.get("label") || this.widget.get('label'+this.number);
    },

    getColor: function() {
      return this.model.get("color");
    },

    render: function() {
      if (this.model && this.model.isPopulated()) {
        var value = this.getValue();
        var stringValue = this.getValueAsString(value);

        this.$el.html(JST['templates/widgets/number/subview']({ value: stringValue, label: this.getLabel() }));

        this.$value = this.$('.number-value');
        this.updateColorClass(value);
        this.updateValueSizeClass(stringValue);
      }

      return this;
    },

    updateColorClass: function(value) {
      var color = this.getColor();
      if (color) {
        this.$value.css("color", color);
      } else {
        this.$value.toggleClass('color-up', value > 0);
        this.$value.toggleClass('color-down', value < 0);
      }
    },

    updateValueSizeClass: function(stringValue) {
      this.$value.toggleClass("value-size-medium", stringValue.length <= 5);
      this.$value.toggleClass("value-size-small", stringValue.length > 5);
    },

    onClose: function() {
      if (this.model) this.model.off();
    }

  });

  views.widgets.Number = Backbone.CompositeView.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "update", "widgetChanged");

      this.updateNumberModels();

      this.model.on('change', this.widgetChanged);
    },

    updateNumberModels: function() {
      this.forEachChild(function(child) {
        child.updateModel();
      });
    },


    widgetChanged: function() {
      this.updateNumberModels();
      this.render();
    },

    render: function() {
      this.numberView1 = new NumberSubview({ widget: this.model, number: 1 });
      this.addChildView(this.numberView1);
      this.numberView2 = new NumberSubview({ widget: this.model, number: 2 });
      this.addChildView(this.numberView2);
      this.numberView3 = new NumberSubview({ widget: this.model, number: 3 });
      this.addChildView(this.numberView3);
      return this;
    },

    update: function() {
      var that = this;
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

})($, _, Backbone, app.views, app.models, app.collections, app.helpers);
