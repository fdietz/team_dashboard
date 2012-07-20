describe("Dashboard View", function() {

  beforeEach(function() {
    this.model = new window.app.models.Dashboard({ name: "example 1", id: 1 });
    this.widget1 = new window.app.models.Widget({ name: "widget 1" });
    this.collection = new window.app.collections.Widget([this.widget1]);
    this.view = new window.app.views.Dashboard({ model: this.model, collection: this.collection });
  });

  it("renders html correctly", function() {
    this.view.render();

    expect(this.view.$("#widget-container")).toExist();
    expect(this.view.$("#widget-dialog")).toExist();
  });
});