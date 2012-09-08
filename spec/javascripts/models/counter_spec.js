describe("Counter Model", function() {
  describe("buildTargetsParams", function() {
    it("builds url params for given targets", function() {
      counter = new window.app.models.Counter({ targets: "a;b" });
      expect(counter.buildTargetsParams()).toEqual("targets[]=a&targets[]=b");
    });
  });

  describe("buildDateRangeParams", function() {
    it("builds date range params for given from and to", function() {
      counter = new window.app.models.Counter({ from: 123, to: 456 });
      expect(counter.buildDateRangeParams()).toEqual("from=123&to=456");
    });
  });

  describe("url", function() {
    it("builds url for given time and target params", function() {
      counter = new window.app.models.Counter({ targets: "a;b", range: '30-minutes',from: 123, to: 456, source: "demo", aggregate_function: "sum" });
      expect(counter.url()).toEqual("/api/counter?targets[]=a&targets[]=b&from=123&to=456&source=demo&aggregate_function=sum");
    });
  });

});