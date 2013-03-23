describe("contenteditable", function() {

  var compile, rootScope, element;

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    rootScope = $rootScope;
    element = angular.element('<div contenteditable ng-model="myContent"></div>');
  }));

  it("should render correctly", function() {
    compile(element)(rootScope);
    rootScope.myContent = 'Hello World';
    rootScope.$apply();

    expect(element).toHaveText("Hello World");
  });

});