describe("Counter Widget View", function() {

  describe("render", function() {
    beforeEach(function() {
      this.model = new window.app.models.Widget({
        name: "widget 1", kind: 'counter', id: 1, source: "demo1", range: "30-minutes",
        targets1: "demo1", aggregate_function1: "sum",
        targets2: "demo2", aggregate_function2: "sum"
      });

      this.view = new window.app.views.widgets.Counter({ model: this.model });
    });

    it("renders default html correctly", function() {
      this.view.render();
      var firstRow = this.view.$(".double-row:first-child");
      var firstSecondaryValueContainer = firstRow.find(".secondary-value-container");
      var secondRow = this.view.$(".double-row:nth-child(2)");
      var secondSecondaryValueContainer = firstRow.find(".secondary-value-container");
      expect(firstRow.find(".value")).toHaveText("0");
      expect(firstSecondaryValueContainer).toHaveClass("color-down");
      expect(firstSecondaryValueContainer.find(".arrow-down")).toExist();
      expect(firstSecondaryValueContainer.find(".secondary-value")).toHaveText(0);

      expect(secondRow.find(".value")).toHaveText("0");
      expect(secondSecondaryValueContainer).toHaveClass("color-down");
      expect(secondSecondaryValueContainer.find(".arrow-down")).toExist();
      expect(secondSecondaryValueContainer.find(".secondary-value")).toHaveText(0);
    });
  });

  describe("update", function() {
    beforeEach(function() {
      this.model = new window.app.models.Widget({
        name: "widget 1", kind: 'counter', id: 1,
        source: "demo1", targets1: "demo1", aggregate_function1: "sum", range: "30-minutes"
      });
      this.view = new window.app.views.widgets.Counter({ model: this.model });
    });

    it("fetches model again and updates view", function() {
      this.view.render();
      spyOn($, "ajax").andCallFake(function(options) {
        var from = window.app.helpers.TimeSelector.getFrom(new Date().getTime(), "30-minutes");
        var previousFrom = window.app.helpers.TimeSelector.getPreviousFrom(new Date().getTime(), "30-minutes");
        var to = window.app.helpers.TimeSelector.getCurrent();
        if (options.url.match("from="+from)) {
          expect(options.url).toEqual("/api/counter?targets[]=demo1&from="+from+"&to="+to+"&source=demo1&aggregate_function=sum");
          options.success({ value: 100 });
        } else if (options.url.match("from="+previousFrom)) {
          expect(options.url).toEqual("/api/counter?targets[]=demo1&from="+previousFrom+"&to="+from+"&source=demo1&aggregate_function=sum");
          options.success({ value: 700 });
        }
      });

      this.view.update();
      var firstRow = this.view.$(".double-row:first-child");
      var secondaryValueContainer = firstRow.find(".secondary-value-container");
      expect(firstRow.find(".value")).toHaveText("100");
      expect(secondaryValueContainer).toHaveClass("color-down");
      expect(secondaryValueContainer.find(".arrow-down")).toExist();
      expect(secondaryValueContainer.find(".secondary-value")).toHaveText(0);
    });
  });
});