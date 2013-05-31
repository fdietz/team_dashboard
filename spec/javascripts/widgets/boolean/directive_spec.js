describe("boolean widget directive", function() {

  var element, compile, rootScope, fixture, ctrl, httpBackend;

  beforeEach(inject(function($compile, $rootScope, $controller, $httpBackend) {
    compile = $compile;
    rootScope = $rootScope;
    httpBackend = $httpBackend;

    element = angular.element('<div boolean>Hello World</div>');
    fixture = loadFixtures("widgets/boolean/show.html");
    rootScope.widget = { label: "Default Text", source: "demo" };
    ctrl = $controller("WidgetCtrl", { $scope: rootScope, $element: null });
  }));

  it("renders label", function() {
    mockData = { value: true, label: "Hello World" };
    httpBackend.expectGET("/api/data_sources/boolean?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".label")).toHaveText("Hello World");
  });

  it("renders default label if none given", function() {
    mockData = { value: true };
    httpBackend.expectGET("/api/data_sources/boolean?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".label")).toHaveText("Default Text");
  });

  it("renders green box if value true", function() {
    mockData = { value: true, label: "Hello World" };
    httpBackend.expectGET("/api/data_sources/boolean?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".boolean-value")).toHaveClass("green");
  });

  it("renders red box if value false", function() {
    mockData = { value: false, label: "Hello World" };
    httpBackend.expectGET("/api/data_sources/boolean?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".boolean-value")).toHaveClass("red");
  });

});
