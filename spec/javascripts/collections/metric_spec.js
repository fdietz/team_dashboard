"use strict";

describe("Metric Collection", function() {

  beforeEach(function() {
    metric = new window.app.collections.Metric();
  });

  it("has default url set", function() {
    expect(metric.url).toBe("/api/metrics");
  });
});
