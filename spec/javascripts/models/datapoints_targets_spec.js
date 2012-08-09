describe('Datapoints Targets Model', function() {

  it("has default urlRoot", function() {
    var metric = new window.app.models.DatapointsTarget();
    expect(metric.urlRoot).toEqual("/api/datapoints_targets");
  });
});
