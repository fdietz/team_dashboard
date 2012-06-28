(function ($, _, Backbone, views, models, collections){
  "use strict";

  var BooleanSubview = Backbone.View.extend({

    className: 'boolean',

    initialize: function(options) {
      _.bindAll(this, "render");
      this.widget = options.widget;
      this.number = options.number;
      this.model.on('change', this.render);
    },

    value: function() {
      return this.model.get('value') || true;
    },

    render: function() {
      this.$el.html(JST['templates/widgets/boolean/subview']({ value: this.value(), label: this.widget.get('label'+this.number) }));

      this.$value = this.$('.boolean-value');
      this.$value.toggleClass('green', this.value() === true);
      this.$value.toggleClass('red', this.value() === false);

      return this;
    },

    onClose: function() {
      this.model.off();
    }

  });

  views.widgets.Boolean = Backbone.View.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "update", "widgetChanged");

      this.updateBooleanModels();

      this.booleanView1 = new BooleanSubview({ model: this.booleanModel1, widget: this.model, number: 1 });
      this.booleanView2 = new BooleanSubview({ model: this.booleanModel2, widget: this.model, number: 2 });
      this.booleanView3 = new BooleanSubview({ model: this.booleanModel3, widget: this.model, number: 3 });

      this.model.on('change', this.widgetChanged);
    },

    updateBooleanModels: function() {
      this.booleanModel1 = new models.Boolean({ source: this.model.get('source1') });
      this.booleanModel2 = new models.Boolean({ source: this.model.get('source2') });
      this.booleanModel3 = new models.Boolean({ source: this.model.get('source3') });
    },


    widgetChanged: function() {
      this.updateBooleanModels();
      this.render();
    },

    render: function() {
      this.$el.empty();
      this.$el.append(this.booleanView1.render().el);
      this.$el.append(this.booleanView2.render().el);
      this.$el.append(this.booleanView3.render().el);
      return this;
    },

    update: function() {
      var that = this;
      var options = { suppressErrors: true };
      return $.when(
        this.booleanModel1.fetch(options),
        this.booleanModel2.fetch(options),
        this.booleanModel3.fetch(options)
      );
    },

    onClose: function() {
      this.model.off();
      this.booleanView1.close();
    }
  });

})($, _, Backbone, app.views, app.models, app.collections);
