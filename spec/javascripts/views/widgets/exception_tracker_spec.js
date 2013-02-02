describe("ExceptionTracker Widget View", function() {

  describe("render", function() {
    beforeEach(function() {
      this.model = new window.app.models.Widget({
        name: "widget 1", kind: 'exception_tracker', id: 1,
        source1: "errbit", "errbit-server_url1": "http://errbit.example.com", "errbit-api_key1": "bla1"
      });

      this.view = new window.app.views.widgets.ExceptionTracker({ model: this.model });
    });

    it("renders default html correctly", function() {
      this.view.render();
      var firstRow = this.view.$(".triple-row:nth-child(1)");
      expect(firstRow).toExist();
    });
  });

  describe("update", function() {
    beforeEach(function() {
      this.model = new window.app.models.Widget({
        name: "widget 1", kind: 'exception_tracker', id: 1,
        source1: "errbit", "errbit-server_url1": "http://errbit.example.com", "errbit-api_key1": "bla1"
      });
      this.view = new window.app.views.widgets.ExceptionTracker({ model: this.model });
    });

    it("updates view with zero errors", function() {
      this.view.render();
      spyOn($, "ajax").andCallFake(function(options) {
        expect(options.url).toEqual("/api/exception_tracker?source=errbit&fields[server_url]=http%3A%2F%2Ferrbit.example.com&fields[api_key]=bla1");
        options.success({
          label: 'Test App 1',
          unresolved_errors: 0,
          last_error_time: null
        });
      });

      this.view.update();
      var firstRow = this.view.$(".triple-row:nth-child(1)");
      expect(firstRow.find(".number-value")).toHaveClass("color-up");
      expect(firstRow.find(".label-container-two-rows .label").text()).toContain('Test App 1');
      expect(firstRow.find(".label-container-two-rows .secondary-label")).toNotExist;
    });

    it("updates view with one error", function() {
      this.view.render();
      spyOn($, "ajax").andCallFake(function(options) {
        expect(options.url).toEqual("/api/exception_tracker?source=errbit&fields[server_url]=http%3A%2F%2Ferrbit.example.com&fields[api_key]=bla1");
        options.success({
          label: 'Test App 1',
          unresolved_errors: 1,
          last_error_time: (new Date()).toISOString()
        });
      });

      this.view.update();
      var firstRow = this.view.$(".triple-row:nth-child(1)");
      expect(firstRow.find(".number-value")).toHaveClass("color-down");
      expect(firstRow.find(".label-container-two-rows .label").text()).toContain('Test App 1');
      expect(firstRow.find(".label-container-two-rows .secondary-label").text()).toContain('last error occurred &lt; 1m ago');
    });
  });
});