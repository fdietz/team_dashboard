describe("ExceptionTracker Model", function() {

  var model, httpBackend = null;
  beforeEach(inject(function(ExceptionTrackerModel, $httpBackend) {
    httpBackend = $httpBackend;
    model = ExceptionTrackerModel;
  }));

  it("builds url for given source param", function() {
    var mockData = { value: "test" };
    httpBackend.expectGET("/api/data_sources/exception_tracker?source=demo").respond(mockData);

    model.getData({ source: "demo" }).success(function (data) {
      expect(data).toEqual(mockData);
    });

    httpBackend.flush();
  });

});