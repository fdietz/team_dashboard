describe("Number Model", function() {

  it("builds url for given source param", function() {
    model = new window.app.models.Number({ source: "demo" });
    expect(model.url()).toEqual("/api/number?source=demo");
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

      model = new window.app.models.Number({ source: "http_proxy" });
      model.populated = true;
      model.attributes = input;
      model.set("value_path", "parent.child.key");
      expect(model.resolveValue()).toEqual("value");
    });
  });
});