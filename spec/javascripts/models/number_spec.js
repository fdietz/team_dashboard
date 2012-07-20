describe("Number Model", function() {
  beforeEach(function() {
    this.model = new window.app.models.Number({ source: "demo" })
  });

  it("builds url for given source param", function() {
    expect(this.model.url()).toEqual("/api/number?source=demo")
  });
});