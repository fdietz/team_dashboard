# Changelog

## Team Dashboard 2 Release Candidate 1
* I've replaced Backbone.js and now use Angular.js. Some of you may already know that I'm working on a leanpub book [Recipes with Angular.js](https://leanpub.com/recipes-with-angular-js). So, this shouldn't be really surprising. I don't want to start an emotional discussion about what's the better Javascript MVC Framework, but for me using Angular.js leads to less code which is much easier to maintain and understand.
* Moving to Angular.js I was finally able to make it super straight forward to add new widgets. Read more in the [Widgets Developer Guide](https://github.com/fdietz/team_dashboard/blob/master/WIDGETS.markdown)
* Data source plugin implementations are now simplified too in order to make adding new sources even easier. All data source plugins use a single controller to expose the JSON API to the rails app. Additionally, I've deprecated the plugin repository since there wasn't much going on anyways. Instead I will focus to have good quality plugins shipped with Team Dashboard out of the box. There's a [Data Source Plugin Developer Guide](https://github.com/fdietz/team_dashboard/blob/master/SOURCE_PLUGINS.markdown) available as well.
* The counter and number widgets were combined into the number widget. This was a source of confusion for beginners anyways. Additionally, the number widget optionally displays a metric suffix.
* There is a new meter widget (using jQuery knob) which uses the number data source.
* The graph widget has a max y axis value option which is useful if the autoscaling is confused by very large outliers
* The dashboard uses [gridster.js](http://gridster.net/) instead of [jQuery UI Sortable](http://jqueryui.com/sortable/) which finally makes it possible to have different widget sizes in both dimensions. This also means that all widgets support only a single data source - leading to much simpler configuration and API usage.
* New data source plugins: [Pingdom](https://www.pingdom.com/), Shell script, [Hockey App](http://hockeyapp.net/), [Errbit](https://github.com/errbit/errbit) and [New Relic](http://newrelic.com/)
* A more fine tuned look and feel for the widgets


