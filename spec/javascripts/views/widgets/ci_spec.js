describe("Ci Widget View", function() {

  describe("render", function() {
    beforeEach(function() {
      this.model = new window.app.models.Widget({
        name: "widget 1", kind: 'ci', id: 1,
        source1: "travis", source_url1: "http://travis-ci.org", project1: "bla1"
      });

      this.view = new window.app.views.widgets.Ci({ model: this.model });
    });

    it("renders default html correctly", function() {
      this.view.render();
      var firstRow = this.view.$(".triple-row:nth-child(1)");
      expect(firstRow.find(".ci-value")).toExist();
      expect(firstRow.find(".label")).toExist();
    });
  });

  describe("update", function() {
    beforeEach(function() {
      this.model = new window.app.models.Widget({
        name: "widget 1", kind: 'ci', id: 1,
        source1: "travis", server_url1: "http://travis-ci.org", project1: "bla1"
      });
      this.view = new window.app.views.widgets.Ci({ model: this.model });
    });

    it("updates view with green build", function() {
      this.view.render();
      spyOn($, "ajax").andCallFake(function(options) {
        expect(options.url).toEqual("/api/ci?source=travis&server_url=http://travis-ci.org&project=bla1");
        options.success({ last_build_status: 0 });
      });

      this.view.update();
      var firstRow = this.view.$(".triple-row:nth-child(1)");
      expect(firstRow.find(".ci-value")).toHaveClass("green");
    });

    it("updates view with red build", function() {
      this.view.render();
      spyOn($, "ajax").andCallFake(function(options) {
        expect(options.url).toEqual("/api/ci?source=travis&server_url=http://travis-ci.org&project=bla1");
        options.success({ last_build_status: 1 });
      });

      this.view.update();
      var firstRow = this.view.$(".triple-row:nth-child(1)");
      expect(firstRow.find(".ci-value")).toHaveClass("red");
    });

    it("updates view with gray build", function() {
      this.view.render();
      spyOn($, "ajax").andCallFake(function(options) {
        expect(options.url).toEqual("/api/ci?source=travis&server_url=http://travis-ci.org&project=bla1");
        options.success({ last_build_status: -1 });
      });

      this.view.update();
      var firstRow = this.view.$(".triple-row:nth-child(1)");
      expect(firstRow.find(".ci-value")).toHaveClass("gray");
    });
  });
});