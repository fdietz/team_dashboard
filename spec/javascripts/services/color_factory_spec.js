describe("ColorFactory", function() {

  var colorFactory = null;

  beforeEach(inject(function(ColorFactory) {
    colorFactory = ColorFactory;
  }));

  it("returns color hex codes", function() {
    expect(colorFactory.get()).toEqual("#DEFFA1");
    expect(colorFactory.get()).toEqual("#6CCC70");
    expect(colorFactory.get()).toEqual("#FF8900");
  });

});