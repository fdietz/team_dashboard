describe("Widget View", function() {
  beforeEach(function() {
    this.dashboard = new window.app.models.Dashboard({ name: "example 1", id: 1, layout: [1] });
    this.model = new window.app.models.Widget({ name: "widget 1", kind: "boolean", id: 1 });
    this.view = new window.app.views.Widget({ model: this.model, dashboard: this.dashboard, el: this.el });
  });

  it("renders correctly", function() {
    this.view.render();
    expect(this.view.$(".portlet-header")).toExist();
    expect(this.view.$(".portlet-content")).toExist();
  });

  it("should disable edit and delete buttons if dashboard is fullscreen", function() {
    this.view.render();
    this.dashboard.set("fullscreen", true);
    expect(this.view.$(".widget-delete")).not.toBeVisible();
    expect(this.view.$(".widget-edit")).not.toBeVisible();
  });

});