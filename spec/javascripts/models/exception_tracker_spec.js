describe("ExceptionTracker Model", function() {
  beforeEach(function() {
    this.model = new window.app.models.ExceptionTracker({ source: "demo", fields: { server_url: "http://localhost", api_key: "12345" }});
  });

  it("builds url for given source param", function() {
    expect(this.model.url()).toEqual("/api/exception_tracker?source=demo&fields[server_url]=http%3A%2F%2Flocalhost&fields[api_key]=12345");
  });
});