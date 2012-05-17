describe("Graph Collection", function() {

  describe("buildTargetsParams", function() {    
    it("builds url params for given targets", function() {
      graph = new window.app.collections.Graph({ targets: ['a', 'b'] });
      expect(graph.buildTargetsParams()).toBe("targets[]=a&targets[]=b");
    });
  });

  describe("buildTimeParams", function() {
    it("builds time params for given time", function() {
      graph = new window.app.collections.Graph({ time: 'minute' });
      expect(graph.buildTimeParams()).toBe("time=minute");
    });
  });

  describe("url", function() {
    it("builds url for given time and target params", function() {
      graph = new window.app.collections.Graph({ targets: ['a', 'b'], time: 'minute' });
      expect(graph.url()).toBe("/api/graph?targets[]=a&targets[]=b&time=minute");
    });
  });
  
});