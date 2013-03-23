describe("ci widget directive", function() {

  var element, compile, rootScope, fixture, ctrl, httpBackend;

  beforeEach(inject(function($compile, $rootScope, $controller, $httpBackend) {
    compile = $compile;
    rootScope = $rootScope;
    httpBackend = $httpBackend;

    element = angular.element('<div ci>Hello World</div>');
    fixture = loadFixtures("widgets/ci/show.html");
    rootScope.widget = { label: "Default Text", source: "demo" };
    ctrl = $controller("WidgetCtrl", { $scope: rootScope, $element: null });
  }));

  it("renders label", function() {
    mockData = { last_build_status: 0, label: "Hello World" };
    httpBackend.expectGET("/api/data_sources/ci?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".label")).toHaveText("Hello World");
  });

  it("renders default label if none given", function() {
    mockData = { last_build_status: 0 };
    httpBackend.expectGET("/api/data_sources/ci?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".label")).toHaveText("Default Text");
  });

  it("renders green box if last_build_status is 0", function() {
    mockData = { last_build_status: 0, label: "Hello World" };
    httpBackend.expectGET("/api/data_sources/ci?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".ci-value")).toHaveClass("green");
  });

  it("renders red box if last_build_status is 1", function() {
    mockData = { last_build_status: 1, label: "Hello World" };
    httpBackend.expectGET("/api/data_sources/ci?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".ci-value")).toHaveClass("red");
  });

  it("renders gray box if last_build_status is -1", function() {
    mockData = { last_build_status: 1, label: "Hello World" };
    httpBackend.expectGET("/api/data_sources/ci?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".ci-value")).toHaveClass("red");
  });

  it("renders current_status message", function() {
    mockData = { last_build_status: 1, current_status: 0, label: "Hello World" };
    httpBackend.expectGET("/api/data_sources/ci?source=demo").respond(mockData);
    compile(element)(rootScope);
    httpBackend.flush();

    expect(element.find(".secondary-label")).toHaveText("Sleeping...");
  });

});
