describe("WidgetContainer View", function() {

  beforeEach(function() {
    this.el = $("<div id='widget-container'></div>");
    this.model = new window.app.models.Dashboard({ name: "example 1", id: 1, layout: [1,2] });
    this.collection = new window.app.collections.Widget([
      new window.app.models.Widget({ name: "widget 1", kind: 'boolean', id: 1, dashboard_id: 1 }),
      new window.app.models.Widget({ name: "widget 2", kind: 'boolean', id: 2, dashboard_id: 1 })
    ]);
    this.view = new window.app.views.WidgetsContainer({ el: this.el, model: this.model, collection: this.collection });

    // TODO: remove global stuff
    $.Sources = {
      "boolean": {
        "demo": {
          available: true,
          name: "demo"
        }
      },
      "number": {
        "demo": {
          available: true,
          name: "demo"
        }
      },
      "datapoints": {
        "demo": {
          available: true,
          name: "demo"
        }
      },
      "counter": {
        "demo": {
          available: true,
          name: "demo"
        }
      }
    };
  });

  it("renders html correctly", function() {
    this.view.render();

    expect(this.view.$(".widget:nth-child(1)")).toExist();
    expect(this.view.$(".widget:nth-child(1)")).toHaveAttr("data-widget-id", "1");
    expect(this.view.$(".widget:nth-child(2)")).toExist();
    expect(this.view.$(".widget:nth-child(2)")).toHaveAttr("data-widget-id", "2");

    // widget header
    expect(this.view.$(".portlet-header")).toExist();
    expect(this.view.$(".portlet-header .widget-delete")).toExist();
    expect(this.view.$(".portlet-header .widget-edit")).toExist();
  });

});