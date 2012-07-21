describe("Widget Editor View", function() {

  beforeEach(function() {

    this.model = new window.app.models.Widget({ name: "widget 1", kind: "boolean", id: 1, dashboard_id: 1 });
    this.editor = new window.app.views.WidgetEditors.Boolean({ model: this.model });
    this.dashboardModel = new window.app.models.Dashboard({ name: "example 1", id: 1, layout: [1] });
    this.widgetCollection = new window.app.collections.Widget([this.model]);
    this.dashboardView = new window.app.views.Dashboard({ model: this.dashboardModel, collection: this.widgetCollection });

    this.view = new window.app.views.WidgetEditor({
      model: this.model,
      editor: this.editor,
      dashboard: this.dashboardView,
      widgetCollection: this.widgetCollection
    });

    // TODO: remove global stuff
    $.Sources = {
      getDefaultTarget: function() {
        return "demo";
      },
      getDatapoints: function() {
        return [];
      },
      getBoolean: function() {
        return ["demo"];
      },
      getNumber: function() {
        return ["demo"];
      },
      getCounter: function() {
        return "demo";
      }
    };

  });

  it("renders html correctly", function() {
    this.view.render();

    expect(this.view.$(".modal-header")).toExist();
    expect(this.view.$(".modal-body")).toExist();
    expect(this.view.$(".modal-footer")).toExist();
  });

  it("saves model", function() {
    this.view.render();
    spyOn($, "ajax").andCallFake(function(options) {
      console.log(options)
      expect(options.type).toEqual("PUT");
      expect(options.url).toEqual("/api/dashboards/1/widgets/1");
      options.success({});
    });

    this.view.$(".btn-primary").trigger("click");
    expect(this.view.$(".modal")).not.toBeVisible();
  });

});