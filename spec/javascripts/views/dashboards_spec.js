describe("Dashboards View", function() {

  beforeEach(function() {
    this.collection = new window.app.collections.Dashboard([
      new window.app.models.Dashboard({ name: "example 1", id: 1, locked: true }),
      new window.app.models.Dashboard({ name: "example 2", id: 2 })
    ]);
    this.view = new window.app.views.Dashboards({ collection: this.collection });
  });

  it("renders html correctly", function() {
    this.view.render();

    expect(this.view.$("table.table")).toExist();
    expect(this.view.$("table > tbody > tr:first a")).toHaveAttr("href", "/dashboards/1");
    expect(this.view.$("table > tbody > tr:nth-child(2) a")).toHaveAttr("href", "/dashboards/2");
  });

  it("render locked status icon if dashboard is locked", function() {
    this.view.render();
    expect(this.view.$("table > tbody > tr:first > td:first > i")).toHaveClass("icon-lock");
  });
});