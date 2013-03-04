describe("TimeSelector", function() {

  var timeSelector = null;
  beforeEach(inject(function(TimeSelector) {
    timeSelector = TimeSelector;
  }));

  describe("getFrom", function() {
    it("returns timestamp for 30-minutes", function() {
      expect(timeSelector.getFrom("30-minutes")).toEqual(Math.round( (new Date().getTime() - 60*30*1000) / 1000));
    });

    it("returns timestamp for 12-hours", function() {
      expect(timeSelector.getFrom("12-hours")).toEqual(Math.round( (new Date().getTime() - 3600*12*1000) / 1000));
    });

    it("returns timestamp for today", function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      expect(timeSelector.getFrom("today")).toEqual(Math.round(date.getTime() / 1000));
    });

    it("returns timestamp for this week", function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      expect(timeSelector.getFrom("this-week")).toEqual(Math.round( (date.getTime() - 3600*24*7*1000)/1000));
    });

    it("returns timestamp for previous week", function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      expect(timeSelector.getFrom("previous-week")).toEqual(Math.round( (date.getTime() - 3600*24*7*2*1000)/1000));
    });

    it("returns timestamp for this month", function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      expect(timeSelector.getFrom("this-month")).toEqual(Math.round( (date.getTime() - 3600*24*7*4*1000)/1000));
    });

    it("returns timestamp for previous month", function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      expect(timeSelector.getFrom("previous-month")).toEqual(Math.round( (date.getTime() - 3600*24*7*4*2*1000)/1000));
    });

    it("returns timestamp for this year", function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      expect(timeSelector.getFrom("this-year")).toEqual(Math.round( (date.getTime() - 3600*24*7*4*12*1000)/1000));
    });

    it("returns timestamp for previous year", function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      expect(timeSelector.getFrom("previous-year")).toEqual(Math.round( (date.getTime() - 3600*24*7*4*24*1000)/1000));
    });
  });

  describe("getPreviousFrom", function() {

    it("returns timestamp for 30-minutes", function() {
      expect(timeSelector.getPreviousFrom("30-minutes")).toEqual(Math.round( (new Date().getTime() - 2*60*30*1000) / 1000));
    });

    it("returns timestamp for 12-hours", function() {
      expect(timeSelector.getPreviousFrom("12-hours")).toEqual(Math.round( (new Date().getTime() - 2*60*60*12*1000) / 1000));
    });

    it("returns timestamp for today", function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      expect(timeSelector.getPreviousFrom("today")).toEqual(Math.round(date.getTime() / 1000));
    });

    it("returns timestamp for this week", function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      expect(timeSelector.getPreviousFrom("this-week")).toEqual(Math.round( (date.getTime() - 3600*24*7*2*1000)/1000));
    });

    it("returns timestamp for previous week", function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      expect(timeSelector.getPreviousFrom("previous-week")).toEqual(Math.round( (date.getTime() - 3600*24*7*2*2*1000)/1000));
    });

    it("returns timestamp for this month", function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      expect(timeSelector.getPreviousFrom("this-month")).toEqual(Math.round( (date.getTime() - 3600*24*7*4*2*1000)/1000));
    });

    it("returns timestamp for previous month", function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      expect(timeSelector.getPreviousFrom("previous-month")).toEqual(Math.round( (date.getTime() - 3600*24*7*4*2*2*1000)/1000));
    });

    it("returns timestamp for this year", function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      expect(timeSelector.getPreviousFrom("this-year")).toEqual(Math.round( (date.getTime() - 3600*24*7*4*12*2*1000)/1000));
    });

    it("returns timestamp for previous year", function() {
      var date = new Date();
      date.setHours(0,0,0,0);
      expect(timeSelector.getPreviousFrom("previous-year")).toEqual(Math.round( (date.getTime() - 3600*24*7*4*24*2*1000)/1000));
    });
  });

  describe("getCurrent", function() {
    it("returns timestamp for 30-minutes", function() {
      expect(timeSelector.getCurrent("30-minutes")).toEqual(Math.round(new Date().getTime() / 1000));
    });

    it("returns timestamp for 12-hours", function() {
      expect(timeSelector.getCurrent("12-hours")).toEqual(Math.round(new Date().getTime() / 1000));
    });

    it("returns timestamp for today", function() {
      var date = new Date();
      date.setHours(23, 59, 59, 0);
      expect(timeSelector.getCurrent("today")).toEqual(Math.round(date.getTime() / 1000));
    });

    it("returns timestamp for yesterday", function() {
      var date = new Date();
      date.setHours(23, 59, 59, 0);
      expect(timeSelector.getCurrent("yesterday")).toEqual(Math.round( (date.getTime() - 3600*24*1000)/1000));
    });

    it("returns timestamp for this week", function() {
      var date = new Date();
      date.setHours(23, 59, 59, 0);
      expect(timeSelector.getCurrent("this-week")).toEqual(Math.round(date.getTime()/1000));
    });

    it("returns timestamp for previous week", function() {
      var date = new Date();
      date.setHours(23, 59, 59, 0);
      expect(timeSelector.getCurrent("previous-week")).toEqual(Math.round( (date.getTime() - 3600*24*7*1000)/1000));
    });

    it("returns timestamp for this month", function() {
      var date = new Date();
      date.setHours(23, 59, 59, 0);
      expect(timeSelector.getCurrent("this-month")).toEqual(Math.round(date.getTime()/1000));
    });

    it("returns timestamp for previous month", function() {
      var date = new Date();
      date.setHours(23, 59, 59, 0);
      expect(timeSelector.getCurrent("previous-month")).toEqual(Math.round( (date.getTime() - 3600*24*7*4*1000)/1000));
    });

    it("returns timestamp for this year", function() {
      var date = new Date();
      date.setHours(23, 59, 59, 0);
      expect(timeSelector.getCurrent("this-year")).toEqual(Math.round(date.getTime()/1000));
    });

    it("returns timestamp for previous year", function() {
      var date = new Date();
      date.setHours(23, 59, 59, 0);
      expect(timeSelector.getCurrent("previous-year")).toEqual(Math.round( (date.getTime() - 3600*24*7*2*24*1000)/1000));
    });
  });

});
