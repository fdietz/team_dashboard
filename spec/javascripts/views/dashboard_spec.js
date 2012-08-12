describe("Dashboard View", function() {

  beforeEach(function() {
    this.model = new window.app.models.Dashboard({ name: "example 1", id: 1, layout: [1] });
    window.app.helpers.datapointsTargetsPool = new window.app.helpers.DatapointsTargetsPool();

    this.collection = new window.app.collections.Widget([
      new window.app.models.Widget({ name: "widget 1", kind: "boolean", id: 1 })
    ]);
    this.view = new window.app.views.Dashboard({ model: this.model, collection: this.collection });

    // TODO: remove global stuff
    $.Sources = {
      "boolean": {
        "demo": {
          available: true,
          name: "demo"
        }
      },
      "number": {
        "demo": {
          available: true,
          name: "demo"
        }
      },
      "datapoints": {
        "demo": {
          available: true,
          name: "demo"
        }
      },
      "counter": {
        "demo": {
          available: true,
          name: "demo"
        }
      }
    };

  });

  it("renders html correctly", function() {
    this.view.render();

    expect(this.view.$("#widget-container")).toExist();
    expect(this.view.$("#widget-dialog")).toExist();
  });

  describe("#addGraph", function() {
    it("displays widget edit dialog", function() {
      this.view.render();
      this.view.$(".add-graph").trigger("click");
      expect(this.view.$("#widget-dialog .modal-body form")).toExist();
    });
  });

  describe("#addBoolean", function() {
    it("displays widget edit dialog", function() {
      this.view.render();
      this.view.$(".add-boolean").trigger("click");
      expect(this.view.$("#widget-dialog .modal-body form")).toExist();
    });
  });

  describe("#addNumber", function() {
    it("displays widget edit dialog", function() {
      this.view.render();
      this.view.$(".add-number").trigger("click");
      expect(this.view.$("#widget-dialog .modal-body form")).toExist();
    });
  });

  describe("#addCounter", function() {
    it("displays widget edit dialog", function() {
      this.view.render();
      this.view.$(".add-counter").trigger("click");
      expect(this.view.$("#widget-dialog .modal-body form")).toExist();
    });
  });

  describe("#editWidget", function() {
    it("displays widget edit dialog", function() {
      this.view.render();
      this.view.$(".widget-edit").trigger("click");
      expect(this.view.$("#widget-dialog .modal-body form")).toExist();
    });
  });

});