(function ($, _, Backbone, views, models, collections){
  "use strict";

  var NumberSubview = Backbone.View.extend({

    className: 'number',

    initialize: function(options) {
      _.bindAll(this, "render");
      this.widget = options.widget;
      this.number = options.number;
      this.model.on('change', this.render);
    },

    value: function() {
      return this.model.get('value') || 0;
    },

    render: function() {
      console.log("render", this.model.toJSON())
      this.$el.html(JST['templates/widgets/number/subview']({ value: this.model.get("value"), label: this.widget.get('label'+this.number) }));

      this.$value = this.$('.number-value');
      this.updateValueSizeClass();
      return this;
    },

    updateValueSizeClass: function(){
      var str = this.value().toString().length;
      this.$value.removeClass("number-value-size-medium");
      this.$value.removeClass("number-value-size-small");

      if (str <= 5) {
        this.$value.addClass("number-value-size-medium");
      } else {
        this.$value.addClass("number-value-size-small");
      }
    },

    onClose: function() {
      this.model.off();
    }

  });

  views.widgets.Number = Backbone.View.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "update", "widgetChanged");

      this.updateNumberModels();

      this.numberView1 = new NumberSubview({ model: this.numberModel1, widget: this.model, number: 1 });
      this.numberView2 = new NumberSubview({ model: this.numberModel2, widget: this.model, number: 2 });
      this.numberView3 = new NumberSubview({ model: this.numberModel3, widget: this.model, number: 3 });

      this.model.on('change', this.widgetChanged);
    },

    updateNumberModels: function() {
      this.numberModel1 = new models.Number({ source: this.model.get('source1') });
      this.numberModel2 = new models.Number({ source: this.model.get('source2') });
      this.numberModel3 = new models.Number({ source: this.model.get('source2') });
    },


    widgetChanged: function() {
      this.updateNumberModels();
      this.render();
    },

    render: function() {
      this.$el.empty();
      this.$el.append(this.numberView1.render().el);
      this.$el.append(this.numberView2.render().el);
      this.$el.append(this.numberView3.render().el);
      return this;
    },

    update: function() {
      var that = this;
      var options = { suppressErrors: true };
      return $.when(
        this.numberModel1.fetch(options),
        this.numberModel2.fetch(options),
        this.numberModel3.fetch(options)
      );
    },

    onClose: function() {
      this.model.off();
      this.numberView1.close();
    }
  });

})($, _, Backbone, app.views, app.models, app.collections);
