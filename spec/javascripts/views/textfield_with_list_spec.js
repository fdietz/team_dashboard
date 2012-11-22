describe("TextfieldWithList View", function() {
  beforeEach(function() {
    jasmine.getFixtures().set("<input id='test' type='text'></input>");
    this.el = $("input#test");
    this.el.val("metric1;metric2");
    this.view = new window.app.views.TextfieldWithList({ originalInput: this.el });
  });

  it("renders correctly", function() {
    this.view.render();
    container = this.view.$(".selectable-container");
    expect(container.find(".input-append")).toExist();
    list = container.find(".list");
    expect(list).toExist();
    expect(list.children().length).toEqual(2);
  });

  it("remove item if remove icon clicked", function() {
    this.view.render();
    container = this.view.$(".selectable-container");
    list = container.find(".list");
    list.find("li:nth-child(1) .remove").trigger("click");
    expect(list.children().length).toEqual(1);
  });

  it("add item if add button clicked", function() {
    this.view.render();
    container = this.view.$(".selectable-container");
    list = container.find(".list");

    input = this.view.$(".selectable-input");
    input.val("my_metric");

    this.view.$(".add").removeAttr("disabled").trigger("click");
    expect(list.children().length).toEqual(3);
  });

});