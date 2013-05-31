# Team Dashboard

Team Dashboard lets you visualize your team's metrics all in one place (see [Screenshots](http://fdietz.github.com/team_dashboard/)). It is build to be shown on a big screen in your team's space.

[Heroku hosted Demo](http://team-dashboard.herokuapp.com/)

It has built-in support for [Graphite](http://graphite.wikidot.com/), [Ganglia](http://ganglia.sourceforge.net/), [Jenkins](http://jenkins-ci.org/), [Travis CI](http://travis-ci.org/), [Errbit](https://github.com/errbit/errbit), [New Relic](http://newrelic.com/), [Pingdom](https://www.pingdom.com/), [Sensu](https://github.com/sensu) and more and makes it really easy to add more data sources.

It is implemented as a Rails app and uses ActiveRecord to store your custom dashboards configuration.

Support via [Team Dashboard Google Group](https://groups.google.com/forum/#!forum/team_dashboard)

## News

### Team Dashboard 2 RC2 is available
Lots of new features and bugfixes. This is (hopefully) the last release candidate!

Read the [Changelog](CHANGELOG.md)!

### Team Dashboard 2 RC1 is available
Please checkout the [Changelog](CHANGELOG.md) and read the [Migration Guide](VERSION2_MIGRATION.markdown).

## Getting Started

Clone the repository:

    git clone git://github.com/fdietz/team_dashboard.git

Run bundler:

    bundle install

Create a database.yml from the example config (using MySQL):

    cp config/database.example.yml config/database.yml

Create the database and run migrations:

    rake db:create && rake db:migrate

There is an initial "Demo" source and sample dashboards provided. Generate these via:

    rake populate

Start the Rails server:

    rails s

or use unicon directly:

    bundle exec unicorn -c config/unicorn.rb

### Running the build

If you want to run the tests locally, you will need to install PhantomJS

    brew update && brew install phantomjs

Run the unit tests (ruby & js)

    rake

## Configuration

System-wide configuration settings are done in either `application.rb` or with an environment variable.

For example when configuring `graphite` you can see the configuration settings in application.rb:

    config.graphite_url = ENV['GRAPHITE_URL']

You can either change the configuration there or set the environment variable when starting the rails app:

    GRAPHITE_URL=http://localhost:8080 rails s

All data sources reside in `app/models/sources` and provide source code documentation with further details.

# Dashboard Widgets

A dashboard in Team Dashboard consists of multiple Widgets, which request data from a data source via AJAX request.

All widgets have a name, time interval in which to update themselves and a data source as a common configuration.

You can easily add your own data source plugins ([Data Source Plugins Developer Guide](SOURCE_PLUGINS.markdown)) and implement custom widgets ([Widget Developer Guide](WIDGETS.markdown)).

## Available Widgets

### Graph Widget
The graph widget shows a time series line or area graph. Use it to show number of visits on your web page or number of currently online users and follow-up on trends.

It currently supports [Graphite](http://graphite.wikidot.com/) and [Ganglia](http://ganglia.sourceforge.net/).

### Number Widget
Shows the current integer value provided by the data source, the percentage of change compared to the previous value and an optional label. Use it to show for the example the number of errors on specific systems or the number of users.

It currently supports a [New Relic](http://newrelic.com/), [Hockey App](http://hockeyapp.net/), http proxy data source and Issue counter for [Jira Filters](JIRA_COUNTER.markdown).

### Boolean Widget
Shows the current boolean value provided by the data source and an optional label. Use it to show for example the success of a Jenkins build or the health status of a system.

It currently supports [Pingdom](https://www.pingdom.com/), arbitrary shell commands and a http proxy data source.

### Alert Widget
It is similar to the Boolean Widget. It is designed to show the alerts of your system. The idea behind was introducing a possibility for linking the dashboard with the Sensu monitoring framework and displaying the alerts and the respective messages.

It currently supports [Sensu](https://github.com/sensu).

### CI (Continous Integration Server) Widget
Shows the current build status for a given project.

It currently supports [Jenkins](http://jenkins-ci.org/) and [Travis CI](https://travis-ci.org/).

### Exception Tracker Widget
Shows the number of unresolved errors in your exception tracker, and when the last error occurred. It currently supports [Errbit](https://github.com/errbit/errbit).

## Credits & Contributors

Thanks go to Martin Tschischauskas and Marno Krahmer who worked with me on the first iteration which was build as part of a [XING](http://www.xing.com) Hackathon Project.

* [luxflux](https://github.com/luxflux) (Raffael Schmid)
* [frankmt](https://github.com/frankmt) (Francisco Trindade)
* [leejones](https://github.com/leejones) (Lee Jones)
* [rngtng](https://github.com/rngtng) (Tobias Bielohlawek)
* [ndbroadbent](https://github.com/ndbroadbent) (Nathan Broadbent)
* [DraganMileski](https://github.com/DraganMileski) (Dragan Mileski)
* [averell23](https://github.com/averell23) (Daniel Hahn)
* [martintsch](https://github.com/martintsch) (Martin Tschischauskas)
* Marno Krahmer

## The MIT License

Copyright (c) 2012 Frederik Dietz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
