describe("Datapoints Targets Collection", function() {

  beforeEach(function() {
    this.collection = new window.app.collections.DatapointsTarget({ source: "demo" });
  });

  it("has default url set", function() {
    expect(this.collection.url()).toEqual("/api/datapoints_targets?source=demo");
  });
});
