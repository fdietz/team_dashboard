describe("Datapoints Targets Collection", function() {

  beforeEach(function() {
    metric = new window.app.collections.DatapointsTagerts({ source: "demo" });
  });

  it("has default url set", function() {
    expect(metric.url()).toEqual("/api/datapoints_targets?source=demo");
  });
});
