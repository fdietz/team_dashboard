// describe("Autocomplete", function() {

//   var compile, rootScope, httpBackend, mockData, element;

//   beforeEach(inject(function($compile, $rootScope, $httpBackend) {
//     compile = $compile;
//     rootScope = $rootScope;
//     httpBackend = $httpBackend;
//     mockData = ["Peter", "John"];
//     rootScope.myUrl = "api/test.json";
//     element = angular.element('<input td-autocomplete="myUrl" autocomplete="off" ng-model="newTarget" type="text">');
//   }));

//   it("should render correctly", function() {

//     compile(element)(rootScope);
//     rootScope.newTarget = "P";
//     rootScope.$apply();
//     rootScope.newTarget = "Pete";
//     rootScope.$apply();
//     console.log(element.html())

//     httpBackend.expectGET(rootScope.myUrl).respond(mockData);
//     // element.val("pet");
//     httpBackend.flush();

//     console.log("element", element);
//   });
// });