describe("meter widget directive", function() {
  var element, compile, rootScope, fixture, ctrl, httpBackend;

  beforeEach(inject(function($compile, $rootScope, $controller, $httpBackend) {
    compile = $compile;
    rootScope = $rootScope;
    httpBackend = $httpBackend;

    element = angular.element('<div meter></div>');
    fixture = loadFixtures("widgets/meter/show.html");
    rootScope.widget = { label: "Default Text", source: "demo" };
    ctrl = $controller("WidgetCtrl", { $scope: rootScope, $element: null });
  }));

  it("renders value", function() {
    mockData = { value: 10, label: "Hello World" };
    httpBackend.expectGET("/api/data_sources/number?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find("input")).toHaveValue(10);
  });

  it("renders label", function() {
    mockData = { value: 10, label: "Hello World" };
    httpBackend.expectGET("/api/data_sources/number?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".label")).toHaveText("Hello World");
  });

  it("renders default label if none given", function() {
    mockData = { value: 10 };
    httpBackend.expectGET("/api/data_sources/number?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".label")).toHaveText("Default Text");
  });

});
