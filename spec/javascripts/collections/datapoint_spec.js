describe("Graph Collection", function() {

  describe("buildTargetsParams", function() {
    it("builds url params for given targets", function() {
      graph = new window.app.collections.Datapoint({ targets: "a,b" });
      expect(graph.buildTargetsParams()).toEqual("targets[]=a&targets[]=b");
    });
  });

  describe("buildDateRangeParams", function() {
    it("builds date range params for given from and to", function() {
      graph = new window.app.collections.Datapoint({ from: 123, to: 456 });
      expect(graph.buildDateRangeParams()).toEqual("from=123&to=456");
    });
  });

  describe("url", function() {
    it("builds url for given time and target params", function() {
      graph = new window.app.collections.Datapoint({ targets: "a,b", from: 123, to: 456, source: "demo" });
      expect(graph.url()).toEqual("/api/datapoints?targets[]=a&targets[]=b&from=123&to=456&source=demo");
    });
  });

});
