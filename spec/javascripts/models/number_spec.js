describe("Number Model", function() {

  it("builds url for given source param", function() {
    model = new window.app.models.Number({ source: "demo" });
    expect(model.url()).toEqual("/api/number?source=demo");
  });

});