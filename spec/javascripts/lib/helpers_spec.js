describe("Helpers Model", function() {

  describe("suffixFormatter", function() {
    it("return number as is if < 1000", function() {
      expect(window.app.helpers.suffixFormatter(90, 1)).toEqual("90");
    });

    it("return number and k if > 1000", function() {
      expect(window.app.helpers.suffixFormatter(1090, 1)).toEqual("1k");
    });

    it("return number and k if > 1000000", function() {
      expect(window.app.helpers.suffixFormatter(1000090, 1)).toEqual("1M");
    });

    it("return number and k if > 1000000000", function() {
      expect(window.app.helpers.suffixFormatter(1000000090, 1)).toEqual("1G");
    });

    it("return number with 2 fixed points if < 1", function() {
      expect(window.app.helpers.suffixFormatter(0.009, 1)).toEqual("0.01");
    });
  });

});