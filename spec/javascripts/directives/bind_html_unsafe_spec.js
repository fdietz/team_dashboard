describe("BindHtmlUnsafe", function() {

  var compile, rootScope, fixture, element;

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    rootScope = $rootScope;
    element = angular.element('<div td-bind-html-unsafe="myContent"></div>');
  }));

  it("should render correctly", function() {
    compile(element)(rootScope);
    rootScope.myContent = '<p ng-class="{ red : true }">Hello World</p>';
    rootScope.$apply();

    expect(element.find("p")).toHaveClass("red");
  });

});