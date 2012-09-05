describe("Boolean Model", function() {
  beforeEach(function() {
    this.boolean = new window.app.models.Boolean({ source: "demo" });
  });

  it("builds url for given source param", function() {
    expect(this.boolean.url()).toEqual("/api/boolean?source=demo&include_response_body=false");
  });
});