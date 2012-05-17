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

  describe("render", function() {

    it("returns the view object", function() {
      expect(this.view.render()).toEqual(this.view);
    });

    it("produces correct html", function() {
      this.view.render();
      var label = this.view.$("span[data-inline-edit]");
      var inlineForm = this.view.$("form[data-inline-edit]");
      expect(label).toHaveText("name");
      expect(label).toBeVisible();
    });

  });

  describe("editable title", function() {
    
    beforeEach(function() {
      this.view.render();
      this.label = this.view.$("span[data-inline-edit]");
      this.inlineForm = this.view.$("form[data-inline-edit]");
      this.input = this.view.$("form[data-inline-edit]>input");
    });

    it("toggles title and input on click", function() {
      expect(this.label).toBeVisible();
      expect(this.inlineForm).not.toBeVisible();

      this.label.trigger("click");

      expect(this.label).not.toBeVisible();
      expect(this.inlineForm).toBeVisible();
    });

    it("cancels edit on keyup of escape", function() {
      this.label.trigger("click"); // make title editable
      var event = jQuery.Event("keyup");
      event.keyCode = 27;
      this.input.trigger(event);

      expect(this.label).toBeVisible();
      expect(this.inlineForm).not.toBeVisible();
    });

    it("finish edit and save title on submit event", function() {
      this.label.trigger("click"); // make title editable
      this.view.$("form[data-inline-edit]").trigger("submit");

      expect(this.label).toBeVisible();
      expect(this.inlineForm).not.toBeVisible();
      expect(this.instrument.get("name")).toBe(this.view.$("form[data-inline-edit]>input").val());
    });

    it("finish edit and save title on blur event", function() {
      this.label.trigger("click"); // make title editable
      this.view.$("form[data-inline-edit]>input").trigger("blur");

      expect(this.label).toBeVisible();
      expect(this.inlineForm).not.toBeVisible();
      expect(this.instrument.get("name")).toBe(this.view.$("form[data-inline-edit]>input").val());
    });    

  });
  
});