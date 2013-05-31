describe("number widget directive", function() {
  var element, compile, rootScope, fixture, ctrl, httpBackend;

  beforeEach(inject(function($compile, $rootScope, $controller, $httpBackend) {
    compile = $compile;
    rootScope = $rootScope;
    httpBackend = $httpBackend;

    element = angular.element('<div number>Hello World</div>');
    fixture = loadFixtures("widgets/number/show.html");
    rootScope.widget = { label: "Default Text", source: "demo" };
    ctrl = $controller("WidgetCtrl", { $scope: rootScope, $element: null });
  }));

  it("renders value", function() {
    mockData = { value: 10, label: "Hello World" };
    httpBackend.expectGET("/api/data_sources/number?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".default-value")).toHaveText("10");
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

  it("renders arrow-up class if value > 0", function() {
    rootScope.previousData = { value: 5 };
    mockData = { value: 10 };
    httpBackend.expectGET("/api/data_sources/number?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".label")).toHaveText("Default Text");
    expect(element.find(".secondary-value-container span")).toHaveClass("arrow-up");
  });

  it("renders arrow-down class if value > 0", function() {
    rootScope.previousData = { value: 15 };
    mockData = { value: 10 };
    httpBackend.expectGET("/api/data_sources/number?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".label")).toHaveText("Default Text");
    expect(element.find(".secondary-value-container span")).toHaveClass("arrow-down");
  });

  it("calculates percentage of change", function() {
    rootScope.previousData = { value: 5 };
    mockData = { value: 10 };
    httpBackend.expectGET("/api/data_sources/number?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".secondary-value")).toHaveText("50 %");
  });

});
