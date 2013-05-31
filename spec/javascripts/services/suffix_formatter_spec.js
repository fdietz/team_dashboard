describe("SuffixFormatter", function() {

  var suffixFormatter = null;

  beforeEach(inject(function(SuffixFormatter) {
    suffixFormatter = SuffixFormatter;
  }));

  it("return number as is if < 1000", function() {
    expect(suffixFormatter.format(90, 1)).toEqual("90");
  });

  it("return number and k if > 1000", function() {
    expect(suffixFormatter.format(1090, 1)).toEqual("1k");
  });

  it("return number and k if > 1000000", function() {
    expect(suffixFormatter.format(1000090, 1)).toEqual("1M");
  });

  it("return number and k if > 1000000000", function() {
    expect(suffixFormatter.format(1000000090, 1)).toEqual("1G");
  });

  it("return number with 2 fixed points if < 1", function() {
    expect(suffixFormatter.format(0.009, 1)).toEqual("0.01");
  });

});