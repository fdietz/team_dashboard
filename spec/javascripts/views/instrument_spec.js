describe("Instruments View", function() {

  beforeEach(function() {
    setFixtures('<div id="container"></div>');
    this.instrument = new window.app.models.Instrument({ name: "name", metrics: [] });
    this.view = new window.app.views.Instrument({ el: $("#container"), model: this.instrument });
  });

  afterEach(function() {
    this.view.remove();
  });

  it("is backed by a model instance", function() {
    expect(this.view.model).toBeDefined();
  });

  describe("Rendering", function() {

    it("returns the view object", function() {
      expect(this.view.render()).toEqual(this.view);
    });

    it("produces correct html", function() {
      this.view.render();
      var label = this.view.$("span[data-inline-edit]");
      var inlineForm = this.view.$("form[data-inline-edit]");
      expect(label).toHaveText("name");
      expect(label).toBeVisible();
      expect(inlineForm).not.toBeVisible();

      label.trigger("click");

      expect(label).not.toBeVisible();
      expect(inlineForm).toBeVisible();
    });

  });
  
});