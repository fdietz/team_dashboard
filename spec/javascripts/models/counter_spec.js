describe("Counter Model", function() {
  describe("buildTargetsParams", function() {
    it("builds url params for given targets", function() {
      graph = new window.app.models.Counter({ targets: "a,b" });
      expect(graph.buildTargetsParams()).toEqual("targets[]=a&targets[]=b");
    });
  });

  describe("buildDateRangeParams", function() {
    it("builds date range params for given from and to", function() {
      graph = new window.app.models.Counter({ from: 123, to: 456 });
      expect(graph.buildDateRangeParams()).toEqual("from=123&to=456");
    });
  });

  describe("url", function() {
    it("builds url for given time and target params", function() {
      graph = new window.app.models.Counter({ targets: "a,b", from: 123, to: 456, source: "demo", aggregate_function: "sum" });
      expect(graph.url()).toEqual("/api/counter?targets[]=a&targets[]=b&from=123&to=456&source=demo&aggregate_function=sum");
    });
  });

});