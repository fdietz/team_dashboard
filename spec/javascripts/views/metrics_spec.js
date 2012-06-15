"use strict";

describe("Metrics View", function() {

  beforeEach(function() {
    setFixtures('<div id="metrics-list"></div>');
    this.metrics = new window.app.collections.Metric();
    this.metrics.create({ name: "name1"});
    this.metrics.create({ name: "name2"});
    this.view = new window.app.views.Metrics({ el: $('#metrics-list'), collection: this.metrics });
  });

  afterEach(function() {
    this.view.remove();
  });

  it("is backed by a collection instance", function() {
    expect(this.view.collection).toBeDefined();
  });

  describe("Rendering", function() {

    it("returns the view object", function() {
      expect(this.view.render()).toEqual(this.view);
    });

    it("produces correct html", function() {
      this.view.render();

      expect(this.view.$("a:first")).toHaveText("name1");
      expect(this.view.$("a:last")).toHaveText("name2");
    });

  });
  
});
