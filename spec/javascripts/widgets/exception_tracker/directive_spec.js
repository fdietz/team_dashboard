describe("exception_tracker widget directive", function() {

  var element, compile, rootScope, fixture, ctrl, httpBackend;

  beforeEach(inject(function($compile, $rootScope, $controller, $httpBackend) {
    compile = $compile;
    rootScope = $rootScope;
    httpBackend = $httpBackend;

    element = angular.element('<div exception_tracker>hello</div>');
    fixture = loadFixtures("widgets/exception_tracker/show.html");

    rootScope.widget = { label: "Default Text", source: "demo" };
    ctrl = $controller("WidgetCtrl", { $scope: rootScope, $element: null });
  }));

  it("renders label", function() {
    mockData = { unresolved_errors: 0, label: "Hello World" };
    httpBackend.expectGET("/api/data_sources/exception_tracker?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".label")).toHaveText("Hello World");
  });

  it("renders default label if none given", function() {
    mockData = { unresolved_errors: 0 };
    httpBackend.expectGET("/api/data_sources/exception_tracker?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".label")).toHaveText("Default Text");
  });

  it("renders green box if unresolved_errors equals 0", function() {
    mockData = { unresolved_errors: 0, label: "Hello World" };
    httpBackend.expectGET("/api/data_sources/exception_tracker?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".default-value")).toHaveClass("color-up");
  });

  it("renders red box if unresolved_errors > 1", function() {
    mockData = { unresolved_errors: 1, label: "Hello World" };
    httpBackend.expectGET("/api/data_sources/exception_tracker?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".default-value")).toHaveClass("color-down");
  });

});
