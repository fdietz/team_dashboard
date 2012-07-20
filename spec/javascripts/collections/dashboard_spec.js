describe("Dashboard Collection", function() {

  beforeEach(function() {
    this.dashboard = new window.app.collections.Dashboard();
  });

  it("has default url set", function() {
    expect(this.dashboard.url).toBe("/api/dashboards");
  });

});
