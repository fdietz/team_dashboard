describe("Ci Model", function() {
  beforeEach(function() {
    this.model = new window.app.models.Ci({ source: "demo", server_url: "http://localhost", project: "test-build" });
  });

  it("builds url for given source param", function() {
    expect(this.model.url()).toEqual("/api/ci?source=demo&server_url=http%3A%2F%2Flocalhost&project=test-build");
  });
});