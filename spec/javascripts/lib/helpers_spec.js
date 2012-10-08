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

  describe("TimeSelector", function() {

    describe("getFrom", function() {
      it("returns timestamp for 30-minutes", function() {
        expect(window.app.helpers.TimeSelector.getFrom("30-minutes")).toEqual(Math.round( (new Date().getTime() - 60*30*1000) / 1000));
      });

      it("returns timestamp for 12-hours", function() {
        expect(window.app.helpers.TimeSelector.getFrom("12-hours")).toEqual(Math.round( (new Date().getTime() - 60*60*12*1000) / 1000));
      });

      it("returns timestamp for today", function() {
        var date = new Date();
        date.setHours(0,0,0,0);
        expect(window.app.helpers.TimeSelector.getFrom("today")).toEqual(Math.round(date.getTime() / 1000));
      });
    });

    describe("getPreviousFrom", function() {
      it("returns timestamp for 30-minutes", function() {
        expect(window.app.helpers.TimeSelector.getPreviousFrom("30-minutes")).toEqual(Math.round( (new Date().getTime() - 2*60*30*1000) / 1000));
      });

      it("returns timestamp for 12-hours", function() {
        expect(window.app.helpers.TimeSelector.getPreviousFrom("12-hours")).toEqual(Math.round( (new Date().getTime() - 2*60*60*12*1000) / 1000));
      });

      it("returns timestamp for today", function() {
        var date = new Date();
        date.setHours(0,0,0,0);
        expect(window.app.helpers.TimeSelector.getPreviousFrom("today")).toEqual(Math.round(date.getTime() / 1000));
      });
    });

    describe("getCurrent", function() {
      it("returns timestamp for 30-minutes", function() {
        expect(window.app.helpers.TimeSelector.getCurrent("30-minutes")).toEqual(Math.round(new Date().getTime() / 1000));
      });

      it("returns timestamp for 12-hours", function() {
        expect(window.app.helpers.TimeSelector.getCurrent("12-hours")).toEqual(Math.round(new Date().getTime() / 1000));
      });

      it("returns timestamp for today", function() {
        var date = new Date();
        date.setHours(23, 59, 59, 0);
        expect(window.app.helpers.TimeSelector.getCurrent("today")).toEqual(Math.round(date.getTime() / 1000));
      });
    });

  });

});