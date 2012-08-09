describe("Number Model", function() {
  beforeEach(function() {
    this.model = new window.app.models.Number({ source: "demo" });
  });

  it("builds url for given source param", function() {
    expect(this.model.url()).toEqual("/api/number?source=demo");
  });

  describe("#resolveValue", function() {
    it("returns resolved value", function() {
      input = {
        parent: {
          child: {
            key: "value"
          }
        }
      };

      this.model.populated = true;
      this.model.attributes = input;
      this.model.set("value_path", "parent.child.key");
      expect(this.model.resolveValue()).toEqual("value");
    });
  });
});