describe("Dashboard View", function() {

  beforeEach(function() {
    // TODO: why is graph.js setting the source of metrics collection?
    window.app.collections.datapointsTargets = new window.app.collections.DatapointsTarget({});
    spyOn(window.app.collections.datapointsTargets, "fetch");

    this.model = new window.app.models.Dashboard({ name: "example 1", id: 1, layout: [1] });
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
      },
      "datapoints_targets": {
        "demo": {
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