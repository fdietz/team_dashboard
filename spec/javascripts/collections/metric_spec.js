describe("Metric Collection", function() {

  beforeEach(function() {
    metric = new window.app.collections.Metric({ source: "demo" });
  });

  it("has default url set", function() {
    expect(metric.url()).toEqual("/api/metrics?source=demo");
  });
});
