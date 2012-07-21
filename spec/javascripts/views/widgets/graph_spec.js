describe("Graph Widget View", function() {

  describe("render", function() {
    beforeEach(function() {
      this.model = new window.app.models.Widget({
        name: "widget 1", kind: 'graph', id: 1, source: "demo", targets: "demo", range: "30-minutes"
      });
      this.view = new window.app.views.widgets.Graph({ model: this.model });
    });

    it("renders default html correctly", function() {
      this.view.render();
      expect(this.view.$(".graph")).toExist();
      expect(this.view.$(".y-axis")).toExist();
    });
  });

  describe("update", function() {
    beforeEach(function() {
      this.model = new window.app.models.Widget({
        name: "widget 1", kind: 'graph', id: 1, source: "demo", targets: "demo", range: "30-minutes"
      });
      this.view = new window.app.views.widgets.Graph({ model: this.model });
    });

    it("fetches model again and updates view", function() {
      this.view.render();
      spyOn($, "ajax").andCallFake(function(options) {
        var from = window.app.helpers.TimeSelector.getFrom(new Date().getTime(), "30-minutes");
        var to = window.app.helpers.TimeSelector.getCurrent();
        expect(options.url).toEqual("/api/datapoints?targets[]=demo&from="+from+"&to="+to+"&source=demo");
        options.success([{ target: "demo", datapoints:[[1,123], [2,124]] }]);
      });

      var result = this.view.update();
      expect(this.view.$(".rickshaw_graph svg")).toExist();
    });
  });
});