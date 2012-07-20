describe("Widget Model", function() {
  beforeEach(function() {
    this.model = new window.app.models.Widget({ dashboard_id: 1 });
  });

  it("builds url with given dashboard_id for new model", function() {
    expect(this.model.url()).toEqual("/api/dashboards/1/widgets")
  });

  it("builds url with given dashboard_id for existing model", function() {
    this.model.set("id", 1);
    expect(this.model.url()).toEqual("/api/dashboards/1/widgets/1")
  });
});