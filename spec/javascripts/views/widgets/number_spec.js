// describe("Number Widget View", function() {

//   describe("render", function() {
//     beforeEach(function() {
//       this.model = new window.app.models.Widget({
//         name: "widget 1", kind: 'number', id: 1,
//         source1: "demo1", label1: "demo1",
//         source2: "demo2", label2: "demo2",
//         source3: "demo3", label3: "demo3"
//       });

//       this.view = new window.app.views.widgets.Number({ model: this.model });
//     });

//     it("renders default html correctly", function() {
//       this.view.render();
//       var firstRow = this.view.$(".triple-row:nth-child(1)");
//       var secondRow = this.view.$(".triple-row:nth-child(2)");
//       var thirdRow = this.view.$(".triple-row:nth-child(3)");
//       expect(firstRow).toExist();
//       expect(secondRow).toExist();
//       expect(thirdRow).toExist();
//     });
//   });

//   describe("update", function() {
//     beforeEach(function() {
//       this.model = new window.app.models.Widget({
//         name: "widget 1", kind: 'number', id: 1,
//         source1: "demo1", label1: "demo1"
//       });
//       this.view = new window.app.views.widgets.Number({ model: this.model });
//     });

//     it("fetches model again and updates view", function() {
//       this.view.render();
//       spyOn($, "ajax").andCallFake(function(options) {
//         expect(options.url).toEqual("/api/number?source=demo1&include_response_body=false");
//         options.success({ value: 700 });
//       });

//       this.view.update();
//       var firstRow = this.view.$(".triple-row:nth-child(1)");
//       expect(firstRow.find(".number-value")).toHaveText("700");
//     });
//   });
// });