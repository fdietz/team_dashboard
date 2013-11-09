# Changelog

## Team Dashboard 2.2.0
The complete [issue list](https://github.com/fdietz/team_dashboard/issues?milestone=5&state=open) can be found on Github.

* New source plugins:
  * Jira Filter-Count Number Source Plugin (tubit)
  * NodeJS Uptime Boolean Source Plugin #94 (shukydvir)
  * Jenkins Game CI Source Plugin #99 (averell23)
  * Pingdom Response Time Number Plugin #96 (averell23)
* New widgets:
  * Graphite Graph Widget using SVG as exported by graphite web API (#80)
  * Status Table Widget (paulhamby), table with alerts status
* Update to [Rails 4.0 ](http://weblog.rubyonrails.org/2013/6/25/Rails-4-0-final/)
* Update javascript unit tests to use [Karma](http://karma-runner.github.io/), simplified test setup
* Updated all gems to latest versions (including making it work on OS X Mavericks)
* Update to Ruby v1.9.3-p429 (okonomi)
* Updated to AngularJS 1.2
* Document all source plugins including http_proxy options (#114)
* Make Dashboard Column Count for Widgets globally configurable\
* Add better_errors gem
* Improve documentation:
  * Debian prerequisites (#109 kylegordon)
  * hint for database setup (#105)
* Bugfixes:
  * Close Modal Dialog on Navigation
  * round any floating number (c0m4)
  * Fix custom data fields for meter plugin #95 (averell23)
  * Meter Widget, Numeric values w/ fractions for numbers < 5. Meters will adjust the stepping so that they always have 100 steps for their range. #100 (averell23)
  * fix Widget timer internal to wait 2 seconds, instead of 200 msec
  * fix graph target browsing
  * upgrade jquery.gridster

## Team Dashboard 2.0.0
* Bugfix: target selection dialog for datapoints sources (graphite, etc.)
* Bugfix: "can't convert nil into Array" bug, support target browsing for number widget
* Bugfix: Pingdom source, logic was a bit wrong
* Bugfix: set accept header to application/json for http proxy #81
* update jquery.gridster.js plugin to v0.1.0 - 2013-04-09

## Team Dashboard 2 Release Candidate 2
* Number widget optionally displays a metric suffix.
* Number widget supports datapoints data source (number widget now completely replaced the counter widget which was already removed in RC1) as for example graphite (choose `datapoints` as source to view all options)
* New meter widget (using jQuery knob) which uses the number data source.
* New alert widget with its own data source. Initially supports [sensu](http://www.sonian.com/cloud-monitoring-sensu/) (thanks to DraganMileski). Should be useful for future plugins as for example nagios alerts or similar.
* Graph widget supports max y-axis value. Useful if your data has lots of outliers which makes the automatic scaling work nicely again.
* The graph widget has a max y axis value option which is useful if the autoscaling is confused by very large outliers
* Unicorn is the new default rack server. This makes deployment on a free Heroku plan a viable option (#68 - thanks to deathowl)
* Dashboards can be shown in fullscreen mode using [bigscreen.js](https://github.com/bdougherty/BigScreen) (Thanks to ngbroadbent)
* Bugfix: Broken Number::NewRelic source #78
* Bugfix: CI widget loses the light indicator #76
* Bugfix: Sensu bugfixes #72 (thanks to DraganMileski)
* Bugfix: Changing targets length #71 (thanks to hamann)
* Bugfix: Exception Tracker Widget does not work #77

## Team Dashboard 2 Release Candidate 1
* I've replaced Backbone.js and now use Angular.js. Some of you may already know that I'm working on a leanpub book [Recipes with Angular.js](https://leanpub.com/recipes-with-angular-js). So, this shouldn't be really surprising. I don't want to start an emotional discussion about what's the better Javascript MVC Framework, but for me using Angular.js leads to less code which is much easier to maintain and understand.
* Moving to Angular.js I was finally able to make it super straight forward to add new widgets. Read more in the [Widgets Developer Guide](https://github.com/fdietz/team_dashboard/blob/master/WIDGETS.markdown)
* Data source plugin implementations are now simplified too in order to make adding new sources even easier. All data source plugins use a single controller to expose the JSON API to the rails app. Additionally, I've deprecated the plugin repository since there wasn't much going on anyways. Instead I will focus to have good quality plugins shipped with Team Dashboard out of the box. There's a [Data Source Plugin Developer Guide](https://github.com/fdietz/team_dashboard/blob/master/SOURCE_PLUGINS.markdown) available as well.
* The counter and number widgets were combined into the number widget. This was a source of confusion for beginners anyways.
* The dashboard uses [gridster.js](http://gridster.net/) instead of [jQuery UI Sortable](http://jqueryui.com/sortable/) which finally makes it possible to have different widget sizes in both dimensions. This also means that all widgets support only a single data source - leading to much simpler configuration and API usage.
* New data source plugins: [Pingdom](https://www.pingdom.com/) (thanks to DraganMileski), Shell script, [Hockey App](http://hockeyapp.net/), [Errbit](https://github.com/errbit/errbit) (thanks to ndbroadbent) and [New Relic](http://newrelic.com/)
* A more fine tuned look and feel for the widgets
