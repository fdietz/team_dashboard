describe("Helpers Model", function() {

  describe("suffixFormatter", function() {
    it("return number as is if < 1000", function() {
      expect(window.app.helpers.suffixFormatter(90, 1)).toEqual("90");
    });

    it("return number and k if > 1000", function() {
      expect(window.app.helpers.suffixFormatter(1090, 1)).toEqual("1.1k");
    });

    it("return number and k if > 1000000", function() {
      expect(window.app.helpers.suffixFormatter(1000090, 1)).toEqual("1.0M");
    });

    it("return number and k if > 1000000000", function() {
      expect(window.app.helpers.suffixFormatter(1000000090, 1)).toEqual("1.0F");
    });
  });

});