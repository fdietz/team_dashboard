# Team Dashboard Widget

## Introduction

All built-in widgets reside in `app/assets/javascripts/widgets`, each widget with its own directory.

    +- app/assets/javascripts/widgets:
      +- boolean:
        +- directive.js
        +- controller.js
        +- service.js
      +- number:
        +- directive.js
        +- controller.js
        +- service.js

Same goes for HTML templates in `app/assets/javascripts/templates/widgets`.

    +- app/assets/javascripts/templates/widgets
      +- boolean:
        +- show.html
        +- edit.html
      +- number:
        +- show.html
        +- edit.html

And also for stylesheets in `app/assets/stylesheets/widgets`.

    +- app/assets/stylesheets/widgets
      +- boolean:
        +- style.css.scss
      +- number:
        +- style.css.scss

Let's create a file `directive.js` in an `example` directory and follow the tutorial to create a first widget.

## Implementing a "Hello World" Directive

Any Angular.js [directive](http://docs.angularjs.org/guide/directive) can be used as a widget. The smallest "Hello World" example for a directive looks like this:

    app.directive("example", function() {
      return {
        template: "<p>Hello World</p>"
      }
    });

Now to actually see the new directive we have to create a widget on a dashboard. The easiest way is probably to use the rails console:

    Dashboard.find(1).widgets.create!(:name => "test", :kind => "example")

Alternatively, you can use the REST API:

    curl -v -H "Content-type: application/json" -X POST -d '{ "name": "test", "kind": "example" }' http://localhost:3000/api/dashboards/1/widgets

You should now see your new "Hello World" widget! Congratulations!

## Periodically Updating the Widget

In order to periodically update the widget you to integrate it further by specifying a dependency to the `widget` Controller. This controller is defined in the `Widget` directive (the container for your widget) and exposes API methods for Widget implementations. Using a link function you register your widget:

    app.directive("example", function() {

      function link(scope, element, attrs, WidgetCtrl) {

        function update() {
          scope.counter += 1;
        }

        scope.counter = 0;
        WidgetCtrl.init(update);
      }

      return {
        require: "^widget",
        template: "<p>Hello World {{counter}}</p>",
        link: link
      }
    });

The link function injects `WidgetCtrl` as dependency and calls the `init` function to register itself. In the example above we increment a `counter` variable. The Widget controller periodically calls your `update` function. This is already sufficient to implement easy use cases as for example a stop watch or a count down clock.

## Using Previous Values

Let's have a look into another useful feature of the exposed via `WidgetCtrl`. The widget actually memorizes the previous value as long as your update function returns a structure with a data attribute;

    function update() {
      scope.counter += 1;

      if (WidgetCtrl.getMemorizedData()) {
        scope.previousValue = WidgetCtrl.getMemorizedData().counter;
      }

      return { data: { counter: scope.counter }};
    }

In the above code we return the `scope.counter` value and we set the `scope.previousValue` via the `getMemorizedData()` function. This can be very helpful in case that you want to show not only the current state of your widget but also compare it to a previous state. In fact the number widget uses this functionality to show the changes as a percentage.

## Pulling in data via AJAX

Let's look into an example with an AJAX request to pull in some data. We use the existing `number` data source.

    function link(scope, element, attrs, WidgetCtrl) {

      function onSuccess(data) {
        scope.counter = data.value;
      }

      function update() {
        return $http.get("/api/number",
          { params: { source: "demo" } }).success(onSuccess);
      }

      scope.counter = 0;
      WidgetCtrl.init(update);
    }

Using the Angular.js [$http](http://docs.angularjs.org/api/ng.$http) service we do an AJAX request and return the `success` methods result in the `update` method. This is in fact a [$q](http://docs.angularjs.org/api/ng.$q) promise function. The `onSuccess` function uses the response data to update the scope.

## Using an Angular.js Service for our Model

We can cleanup our code a bit by introducing the concept of an Angular service which handles our "model" and requesting new data. Lets add a `service.js` file alongside our existing directive.

    app.factory("ExampleModel", function($http) {
      return $http.get("/api/data_sources/number", { params: { source: "demo" } });
    });

The service only focus is requesting new data. Now, let's use this service in our directive.

    app.directive("example", function($http, ExampleModel) {

      function link(scope, element, attrs, WidgetCtrl) {

        function onSuccess(data) {
          scope.counter = data.value;
        }

        function update() {
          return ExampleModel.success(onSuccess);
        }

        scope.counter = 0;
        WidgetCtrl.init(update);
      }

      return {
        require: "^widget",
        template: "<p>Hello World: {{counter}}",
        link: link
      };
    });

We didn't change much here. We injected the `ExampleModel` and called it in the `update()` function.

## Using an Angular.js Filter to Convert our Rendered Output
As a last example we want to prefix our displayed number with a dollar character using an Angular.js filter. Let's create a new filter by creating a `filter.js` file alongside our existing directive.

    app.filter("dollar", function() {
      return function(input) {
        if (!input) return "";
        return "$ " + input;
      };
    });

The `dollar` directive returns a function which transforms a String input to a String output with a dollar as prefix.

Now to use our filter we need to slightly modify the template again.

    template: "<p>Hello World: {{counter | dollar}}"

The `pipe` character is used here to call our dollar filter.

This example is pretty contrived and you could achieve exactly the same by implementing this in your controller instead. But using a filter gives us a reusable and chainable filter.

Have a look at built-in filters in `app/assets/javascripts/filters` you can reuse in our widget!

## Using a HTML Template
Embedding the template as a string in your directive sucks when the template becomes more complicated. Let's move this template into its own file `show.html` in the `app/assets/templates/widgets/example` directory. In our directive we reference the template now using the `templateUrl` attribute.

    app.directive("example", function($http, ExampleModel) {

      function link(scope, element, attrs, WidgetCtrl) {
        // ..
      }

      return {
        require: "^widget",
        templateUrl: "<%= asset_path('templates/widgets/example/show.html') %>",
        link: link
      };
    });

Note, that since we use the Rails assets pipeline the request URL for the template changes depending on the environment. Therefore we use the `asset_path` method in ERB tags to retrieve the correct URL. In order to get our template processed as ERB file we need to additionally change the filename of our directive to `directive.js.erb`.

## Using a Stylesheet
The only missing part is adding a stylesheet for our widget. Lets add a `style.css.scss` file to the `app/assets/stylesheets/widgets/example` directory.

    .example {
      .red {
        color: red;
      }
    }

It has an `scss` file ending in order to use SASS and is nesting a `red` class inside an `example` class. It is good practice to "namespace" all your changes in such a way to avoid conflicts between existing classes.

    <div class="example">
      <p class="red">Hello World: {{counter | dollar}}
    </div>

Our template now uses both CSS classes! Awesome!

## Pulling in data from external services
In fact all the AJAX requests will be handled by the Rails app, but there is also a proxy service in the Rails app to consume external services. You can use this service in case there exists no data source yet.

TODO: Describe how to use the proxy service

## Widget Configuration
After creating your Widget directive the widget should show up in the "Add Widget..." dropdown menu automatically. But selecting the menu will do nothing, since we are missing the HTML template for the edit dialog.

Let add this template now to `app/assets/javascripts/templates/widgets` as `edit.html`:

    <div td-field label="Name">
      <input name="name" ng-model="widget.name" type="text" autofocus required/>
    </div>

    <div td-field label="Update Interval">
      <select name="update_interval" ng-model="widget.update_interval" ng-options="i.value as i.label for i in updateIntervals" required>
      </select>
    </div>

Try to create your widget again! Much better!

The `td-field` attribute is an Angular.js directive which handles all the error handling and renders a nice [Twitter Bootstrap](http://twitter.github.com/bootstrap/) based form for you.

The attributes `autofocus` is an HTML5 attribute and will place the cursor in the name input field when opening the dialog.

The `required` attribute makes the name attribute a mandatory field.

In order for the error handling to work you must assign a name attribute to all your input fields.

## Using an Angular.js Controller in your Form
Now you can't really do much with the template alone. If you want to provide default values or add more business logic you should use an Angular.js controller.

First use the `ng-controller` directive in our template to wrap our form fields:

    <div ng-controller="ExampleCtrl">

      <div td-field label="Name">
        <input name="name" ng-model="widget.name" type="text" autofocus required/>
      </div>

      <div td-field label="Update Interval">
        <select name="update_interval" ng-model="widget.update_interval" ng-options="i.value as i.label for i in updateIntervals" required>
        </select>
      </div>

    </div>

Next create a `controller.js` file in `app/assets/javascripts/widgets/example` directory. In our initial example we want to setup some default values:

    app.controller("ExampleCtrl", function($scope) {
      if (!$scope.widget.id) {
        $scope.widget.update_interval = 10:
        $scope.widget.size_x = 1:
        $scope.widget.size_y = 1:
      }
    });

The controller gets its `$scope` injected and has access to the `$scope.widget` object to set some default values. The `update_interval` defines how often your directive's update method is called. The size attributes define your widget dimensions. Play around with these dimensions! Note, that we only set these default values if the widget has no assigned `id`, which means we are creating a new widget. We don't want to set these default values when editing a form.