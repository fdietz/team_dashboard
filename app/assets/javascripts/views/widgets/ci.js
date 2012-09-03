(function ($, _, Backbone, views, models, collections){
  "use strict";

  var CiSubview = Backbone.View.extend({

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
        var plugin = _.find($.Sources.ci, function(plugin) {
          return that.getSource() === plugin.name;
        });

        if (plugin) {
          _.each(plugin.fields, function(field) {
            fields[field.name] = that.widget.get(plugin.name + "-" + field.name + that.number);
          });
        }

        this.model = new models.Ci(_.extend(options, { fields: fields } ));
        this.model.on('change', this.render);
      }
    },

    getSource: function() {
      return this.widget.get("source" + this.number);
    },

    getLabel: function() {
      return this.model.get("label") || this.widget.get("label" + this.number);
    },

    getCurrentStatus: function() {
      var status = this.model.get("current_status");
      switch(status) {
        case 0:
          return "Sleeping...";
        case 1:
          return "Building...";
        default:
          return "";
      }
    },

    getValue: function() {
      var value = null;
      if (this.model) {
        value = this.model.get('last_build_status');
        return (typeof value === "undefined") ? true : value;
      } else {
        return -1;
      }
    },

    render: function() {
      if (this.model) {
        this.$el.html(JST['templates/widgets/ci/subview']({ label: this.getLabel(), currentStatus: this.getCurrentStatus() }));

        this.$value = this.$('.ci-value');
        this.$value.toggleClass('green', this.getValue() === 0);
        this.$value.toggleClass('red', this.getValue() === 1);
        this.$value.toggleClass('gray', this.getValue() === -1);
      }

      return this;
    },

    onClose: function() {
      if (this.model) this.model.off();
    }

  });

  views.widgets.Ci = Backbone.CompositeView.extend({

    initialize: function(options) {
      _.bindAll(this, "render", "update", "widgetChanged");
      this.updateCIModels();
      this.model.on('change', this.widgetChanged);
    },

    updateCIModels: function() {
      this.forEachChild(function(child) {
        child.updateModel();
      });
    },

    widgetChanged: function() {
      this.updateCIModels();
      this.render();
    },

    render: function() {
      this.view1 = new CiSubview({ widget: this.model, number: 1 });
      this.addChildView(this.view1);

      this.view2 = new CiSubview({ widget: this.model, number: 2 });
      this.addChildView(this.view2);

      this.view3 = new CiSubview({ widget: this.model, number: 3 });
      this.addChildView(this.view3);

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

})($, _, Backbone, app.views, app.models, app.collections);
