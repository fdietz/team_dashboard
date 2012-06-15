"use strict";

describe('Instrument Model', function() {

  beforeEach(function() {
    instrument = new window.app.models.Instrument();
  });

  it("can be created with default values", function() {
    expect(instrument.get("name")).toBe("Undefined name");
    expect(instrument.get("renderer")).toBe("line");
  });

  it("has default urlRoot", function() {
    expect(instrument.urlRoot).toBe("/api/instruments");
  });

  it("will set passed attributes", function() {
    var instrument = new window.app.models.Instrument({ name: "name"});
    expect(instrument.get("name")).toBe("name");
  });

  it("fires a change event on attribute changes", function() {
    var spy = jasmine.createSpy("-change event callback-");
    instrument.on("change", spy);

    instrument.set({ name: "name"});

    expect(spy).toHaveBeenCalled();
  });

});
