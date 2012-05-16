describe("Instrument Collection", function() {

  beforeEach(function() {
    instrument = new window.app.collections.Instrument();
  });

  it("has default url set", function() {
    expect(instrument.url).toBe("/api/instruments");
  });
});