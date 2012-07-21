(function ($, _, Backbone, views, models, collections) {
  "use strict";

  views.WidgetEditors.Boolean = Backbone.View.extend({

    events: {
      "change select#source1" : "sourceChanged",
      "change select#source2" : "sourceChanged",
      "change select#source3" : "sourceChanged"
    },

    initialize: function() {
      _.bindAll(this, "sourceChanged", "render");
    },

    sourceChanged: function(event) {
      var value  = this.$(event.target).val(),
          id     = this.$(event.target).attr("id"),
          number = id.charAt(id.length-1),
          el     = this.$(".field-http_proxy_url"+number);
      if (value === "http_proxy") {
        el.slideDown();
      } else {
        el.slideUp();
      }
    },

    render: function() {
      this.form = new Backbone.Form({
        data  : this.model.toJSON(),
        schema: this.getSchema()
      });
      this.$el.html(this.form.render().el);

      this.updateHttpProxyFieldVisibility(1);
      this.updateHttpProxyFieldVisibility(2);
      this.updateHttpProxyFieldVisibility(3);

      return this;
    },

    updateHttpProxyFieldVisibility: function(number) {
      if (this.getSourceEl(number).val() === "http_proxy") {
        this.getHttpProxyFieldEl(number).show();
      } else {
        this.getHttpProxyFieldEl(number).hide();
      }
    },

    getSourceEl: function(number) {
      return this.$("select#source"+number);
    },

    getHttpProxyFieldEl: function(number) {
      return this.$(".field-http_proxy_url"+number);
    },

    getValue: function() {
      return this.form.getValue();
    },

    getSources: function() {
      var sources = $.Sources.getBoolean();
      sources.unshift("");
      return sources;
    },

    getUpdateIntervalOptions: function() {
      return [
        { val: 10, label: '10 sec' },
        { val: 600, label: '1 min' },
        { val: 6000, label: '10 min' },
        { val: 36000, label: '1 hour' }
      ];
    },

    getSchema: function() {
      return {
        name:             'Text',
        update_interval:  {
          title: 'Update Interval',
          type: 'Select',
          options: this.getUpdateIntervalOptions()
        },
        source1: { title: "Source 1", type: 'Select', options: this.getSources() },
        http_proxy_url1: {  title: "Proxy URL 1", type: "Text" },
        label1: { title: "Default Label 1", type: 'Text' },
        source2: { title: "Source 2", type: 'Select', options: this.getSources() },
        http_proxy_url2: {  title: "Proxy URL 2", type: "Text" },
        label2: { title: "Default Label 2", type: 'Text' },
        source3: { title: "Source 3", type: 'Select', options: this.getSources() },
        http_proxy_url3: {  title: "Proxy URL 3", type: "Text" },
        label3: { title: "Default Label 3", type: 'Text' }
      };
    }

  });

})($, _, Backbone, app.views, app.models, app.collections);