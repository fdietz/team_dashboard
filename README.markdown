# Team Dashboard

Team Dashboard lets you visualize your team's metrics all in one place (see [Screenshots](http://fdietz.github.com/team_dashboard/)). It is build to be shown on a big screen in your team's space.

[Heroku hosted Demo](http://team-dashboard.herokuapp.com/)

It has built-in support for [Graphite](http://graphite.wikidot.com/), [Ganglia](http://ganglia.sourceforge.net/), [Jenkins](http://jenkins-ci.org/), [Travis CI](http://travis-ci.org/), etc. and makes it really easy to add more input sources.

The Team Dashboard Data Source [Plugin Repository](https://github.com/fdietz/team_dashboard_plugins) contains contributed plugins and documentation on how to implement your own plugins.

It is implemented as a Rails app and uses MySQL to store your custom dashboards configuration.

Support via [Team Dashboard Google Group](https://groups.google.com/forum/#!forum/team_dashboard)

## Getting Started

Clone the repository:

    git clone git://github.com/fdietz/team_dashboard.git

Run bundler:

    bundle install

Create a database.yml from the example config:

    cp config/database.example.yml config/database.yml

Create the database and run migrations:

    rake db:create && rake db:migrate

There is an initial "Demo" source and sample dashboards provided. Generate these via:

    rake populate

Start the Rails server:

    rails s

## Configuration

You have to configure the MySQL database in config/database.yml.

Graphite is the first input source Team Dashboard supports. Use the environment variable GRAPHITE_URL or change the rails configuration (see application.rb and environment specific files) directly.

For example:

    GRAPHITE_URL=http://localhost:8080 rails s

Ganglia is now supported too, it uses the same configuration mechanism

    GANGLIA_URL=http://localhost:8080 rails s

# Dashboard Widgets

A dashboard in Team Dashboard consists of multiple Widgets, which request data from a data source via AJAX request.

All widgets have a name, time interval in which to update themselves and a data source as a common configuration.

## Available Widgets

### Graph Widget
The graph widget shows a time series line graph (using rickshaw.js internally). Use it to show number of visits on your web page or number of currently online users and follow-up on trends.

It currently supports a Demo data source, [Graphite](http://graphite.wikidot.com/), [Ganglia](http://ganglia.sourceforge.net/) and the http proxy source.

#### Configuration
<table>
  <tr>
    <th>Name</th>
    <th>Documentation</th>
  </tr>
  <tr>
    <td>Date Range/Period</td>
    <td>Select a date range of for example "Last 3 hours"</td>
  </tr>
  <tr>
    <td>Size</td>
    <td>Number of Columns (Possible Values: 1, 2 or 3)</td>
  </tr>
  <tr>
    <td>Graph Type</td>
    <td>Either a line or stacked graph.</td>
  </tr>
  <tr>
    <td>Data Source</td>
    <td>Available are demo, graphite, ganglia, http_proxy currently supported.</td>
  </tr>
  <tr>
    <td>Targets</td>
    <td>
      <p>
        In case of Graphite you can pass a comma-separated list of targets (example: <code>visits.server1, visits.server2</code>). It also supports wildcards (example: <code>visits.server.*</code>).
      </p>
      <p>
        In case of Ganglia you need to know the cluster name, hostname and metric name. Usually its easy to obtain these from the graph url directly.
        </br><code>hostname@cluster(metric-name)</code>
      </p>
    </td>
  </tr>
</table>

### Counter Widget
Shows the current value and the percentage of change of the last period. It is based on time series data and uses the same data sources as the graph widget. The widgets supports showing two values. Use it to for example show the current number of online users.

It currently supports a Demo data source, [Graphite](http://graphite.wikidot.com/), [Ganglia](http://ganglia.sourceforge.net/) and the http proxy source.


#### Configuration
<table>
  <tr>
    <th>Name</th>
    <th>Documentation</th>
  </tr>
  <tr>
    <td>Date Range/Period</td>
    <td>Select a date range of for example "Last 3 hours"</td>
  </tr>
  <tr>
    <td>Size</td>
    <td>Number of Columns (Possible Values: 1, 2 or 3)</td>
  </tr>
  <tr>
    <td>Data Source</td>
    <td>Available are demo, graphite, ganglia, http_proxy currently supported.</td>
  </tr>
  <tr>
    <td>Targets</td>
    <td>
      <p>
        In case of Graphite you can pass a comma-separated list of targets (example: <code>visits.server1, visits.server2</code>). It also supports wildcards (example: <code>visits.server.*</code>).
      </p>
      <p>
        In case of Ganglia you need to know the cluster name, hostname and metric name. Usually its easy to obtain these from the graph url directly.
        </br><code>hostname@cluster(metric-name)</code>
      </p>
    </td>
  </tr>
  <tr>
    <td>Aggregate Function</td>
    <td>The values of the selected period are aggregated using selected function. Supports <code>sum</code>, <code>average</code> and <code>delta</code>.</td>
  </tr>
</table>

### Number Widget
Shows the current integer value provided by the data source and a label. The widget supports up to three values. Use it to show for the example the number of errors on specific system.

It currently supports a demo data source and a http proxy data source.

#### Configuration
<table>
  <tr>
    <th>Name</th>
    <th>Documentation</th>
  </tr>
  <tr>
    <td>Date Range/Period</td>
    <td>Select a date range of for example "Last 3 hours"</td>
  </tr>
  <tr>
    <td>Label</td>
    <td>Label for this value</td>
  </tr>
  <tr>
    <td>HTTP Proxy URL (only available for HTTP Proxy Data Source)</td>
    <td>HTTP URL should return a JSON structure as described below</td>
  </tr>
  <tr>
    <td>Value Path (only available for HTTP Proxy Data Source)</td>
    <td>dot notation to select nested value from JSON structure (Example: <code>parent.child.nestedChild.value</code>)</td>
  </tr>
  <tr>
</table>

### Boolean Widget
Shows the current boolean value provided by the data source and an label. The widget supports up to three values. Use it to show for example the success of a Jenkins build.

It currently supports a demo data source and a http proxy data source.

#### Configuration
<table>
  <tr>
    <th>Name</th>
    <th>Documentation</th>
  </tr>
  <tr>
    <td>Date Range/Period</td>
    <td>Select a date range of for example "Last 3 hours"</td>
  </tr>
  <tr>
    <td>Label</td>
    <td>Label for this value</td>
  </tr>
  <tr>
    <td>HTTP Proxy URL (only available for HTTP Proxy Data Source)</td>
    <td>HTTP URL should return a JSON structure as described below</td>
  </tr>
  <tr>
    <td>Value Path (only available for HTTP Proxy Data Source)</td>
    <td>dot notation to select nested value from JSON structure (Example: <code>parent.child.nestedChild.value</code>)</td>
  </tr>
  <tr>
</table>

### CI (Continous Integration Server) Widget
Shows the current build status for a given project. It currently supports a demo source, Jenkins and Travis CI.

#### Configuration
<table>
  <tr>
    <th>Name</th>
    <th>Documentation</th>
  </tr>
  <tr>
    <td>Server URL</td>
    <td>For Travis CI this would be for example <code>http://travis-ci.org</code> for Jenkins for example <code>http://ci.jenkins-ci.org</code></td>
  </tr>
  <tr>
    <td>Project</td>
    <td>Name of Jenkins Job (example: <code>infra_plugin_changes_report</code>) or Travis CI Slug (example: <code>travis-ci/travis-ci</code>)</td>
  </tr>
</table>


## HTTP Proxy Source
As described in the data source plugin repository [documentation](https://github.com/fdietz/team_dashboard_plugins) you can easily add your own data source implementions.

On the other hand you might prefer to offer a service on your server instead. The HTTP proxy source requests data on the server side, the Rails app being the "proxy" of the web app. The JSON format for the specific sources is described below.

#### HTTP Proxy URL
Since we want to support generic JSON documents as data source for various kinds of widgets we use a simple path notation to support selection of a single value. This path selection is currently supported in the Number and Boolean data source.

    {
      "parent" : {
        "child" : {
          "child2" : "myValue"
        }
      }
    }

A value path of "parent.child.child2" would resolve "myValue".

### Datapoints
The datapoints source supports data for rendering graphs and aggregated values

    [
      {
        "target" : "demo.example",
        "datapoints" : [
          [1,123456], [7,23466]
        ]
      },
      {
        "target" : "demo.example2",
        "datapoints" : [
          [-6,123456], [8,23466]
        ]
      }
    ]

### Number
The number data source supports a single integer value and an optional label.

    {
      "value" : 8,
      "label" : "This is an example label"
    }

### Boolean
The boolean data source supports a single boolean value and an optional label.

    {
      "value" : true,
      "label" : "This is an example label"
    }

## Credits & Contributors

Thanks go to Martin Tschischauskas and Marno Krahmer who worked with me on the first iteration which was build as part of a [XING](http://www.xing.com) Hackathon Project.

* [luxflux](https://github.com/luxflux) (Raffael Schmid)

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