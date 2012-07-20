describe("Widget Collection", function() {
  beforeEach(function() {
    this.widget = new window.app.collections.Widget({ dashboard_id: 1});
  });

  it("builds url for given dashboard_id", function() {
    expect(this.widget.url()).toEqual("/api/dashboards/1/widgets");
  });
});