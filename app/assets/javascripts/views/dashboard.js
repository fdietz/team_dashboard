(function (views, models, collections, router) {

  var InstrumentsChooserDialog = Backbone.View.extend({
    events: {
      "click .btn-primary" : "addInstrument"
    },

    initialize: function(options) {
    },
  
    render: function() {
      $(this.el).html(JST['templates/dashboards/instruments_chooser']({ dashboard: this.model.toJSON() }));

      var myModal = this.$('#dashboard-details-modal');
      var that = this;
      collections.instruments.fetch({ 
        success: function(instruments, response) {
          var filtered = instruments.filter(function(instrument) {
              return !_.include(that.model.get("instruments"), instrument.get('id'));
          });

          var instrumentsSmall = new views.InstrumentsSmall({ collection: new collections.Instrument(filtered) });
          instrumentsSmall.render();
          that.$(".instruments-index-small-container").html(instrumentsSmall.el);

          myModal.modal({ keyboard: true });
        },
        error: function(model, response) {
          alert("Error request: "+response);
        }
      });

      return this;
    },

    addInstrument: function() {
      var myModal = this.$('#dashboard-details-modal');
      var tmp = this.model.get("instruments");
      var selectedCheckboxes = $("input:checked").each(function(index) {
        var id = $(this).attr("data-id")
        tmp.push(id);
      });

      myModal.modal("hide");
      this.model.set({ instruments: tmp });
      var result = this.model.save({ 
        success: function(model, request) {
          console.log("saved model: ", model);
        },
        error: function(model, request) {
          alert("failed saving model "+request);
        }
      });
      
      return false;
    }

  });

  views.Dashboard = Backbone.View.extend({
    events: {
      "click .btn.add-instrument"          : "showInstrumentsChooser",
      "click button.dashboard-delete"      : "removeDashboard",
      "click span[data-inline-edit]"       : "editName",
      "submit form[data-inline-edit]"      : "saveName",
      "blur form[data-inline-edit]>input"  : "saveName",
      "keyup form[data-inline-edit]>input" : "cancelEdit",
      "click .time"                        : "switchTime"
    },

    initialize: function(options) {
      _.bindAll(this, "render");
      this.model.bind('reset', this.render);
      this.model.bind('change', this.render);
      this.time = "minute";
      this.size = 1;
      console.log("size", this.size);
      this.widgets = [];
    },

    renderWidgets: function() {
      var that = this;
      var columnCount = 2;
      var container = this.$("#dashboard-widget-container");
      container.html("");
      var widgets = this.widgets;

      _.each(this.widgets, function(widget) {
        widget.close();
        // delete widget;
      });

      this.widgets = [];

      var targets = _.each(this.model.get('instruments'), function(id, index) {
        // var createNewRow = (index % columnCount) == 0;
        var instrument = new app.models.Instrument({ id: id});

        instrument.fetch({
          success: function(model, request) {
            var widget = new views.Widget({ model: model, dashboard: that.model, time: that.time, size: that.size });
            that.widgets.push(widget);

            widget.render();

            // if (createNewRow) {
            //   container = this.$("#dashboard-widget-container");
            //   var newElement = $("<div class='row-fluid'></div>");
            //   container.append(newElement);
            //   container = newElement;
            // }
            
            container.append(widget.el);
          },
          error: function(model, request) {
            alert("Error request "+request);
          }
        });
      });
    },

    render: function() {
      console.log("dashboard render");
      $(this.el).html(JST['templates/dashboards/show']({ dashboard: this.model.toJSON() }));

      this.heading = this.$("span[data-inline-edit]");
      this.form = this.$("form[data-inline-edit]");
      this.input = this.$("form[data-inline-edit]>input");

      var button = this.$("button[data-time='"+this.time+ "']");
      button.addClass("active");

      this.$("#dashboard-widget-container").sortable({
        forcePlaceholderSize: true,
        revert: 300,
        delay: 100,
        opacity: 0.8,
        start: function (e,ui) {
          console.log("start drag");
        },
        stop: function (e,ui) {
          console.log("stop drag");
          // TODO: save dashboard changes
        }
      });

      this.$("#dashboard-widget-container").disableSelection();

      // this.$(".portlet")
      //   .addClass("ui-widget ui-widget-content ui-corner-all")
      //   .find(".portlet-header")
      //   .addClass("ui-widget-header ui-corner-all")
      //   .prepend("<span class='ui-icon ui-icon-minusthick'><i class='icon-minus'></i></span>")
      //   .prepend("<span class='ui-icon ui-icon-minusthick'><i class='icon-cog'></i></span>")
      //   .prepend("<span class='ui-icon ui-icon-minusthick'><i class='icon-remove'></i></span>")
      //   .end()
      //   .find(".portlet-content");

      this.$(".portlet-header .ui-icon").click(function() {
        $(this).toggleClass("ui-icon-minusthick").toggleClass("ui-icon-plusthick");
        $(this).parents(".portlet:first").toggleClass("portlet-minimized");
      });

      // this.$(".column").disableSelection();

      this.renderWidgets();

      return this;
    },

    showInstrumentsChooser: function() {
      console.log("showInstrumentsChooser");
      var dialog = new InstrumentsChooserDialog({ model: this.model });
      dialog.render();

      this.$("#instruments-chooser").html(dialog.el);


      return false;
    },

    removeDashboard: function() {
      console.log("removeDashboard", router);

      var result = this.model.destroy({ 
        success: function(model, request) {
          console.log("destroyed model: ", model);
          window.app.router.navigate("/dashboards", { trigger: true })
        },
        error: function(model, request) {
          alert("failed destroying model "+request);
        }
      });
      
    },

    editName: function() {
      this.heading.toggle();
      this.form.css("display", "inline");
      this.input.focus();
      return false;
    },

    saveName: function() {
      this.heading.toggle();
      this.form.toggle();

      this.heading.html(this.input.val());
      this.model.set({name: this.input.val() });
      this.model.save();
      return false;
    },

    cancelEdit: function(event) {
      if (event.keyCode == 27) {
        this.heading.toggle();
        this.form.toggle();      
      }
    },

    switchTime: function(event) {
      var button = this.$(event.target);
      this.time = button.attr("data-time");
      button.button("toggle");
      this.renderWidgets();
      return false;
    },

  });

})(app.views, app.models, app.collections, app.router);