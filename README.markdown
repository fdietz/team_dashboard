# Team Dashboard

Team Dashboard lets you visualize your team's metrics all in one place (see [Screenshot](https://github.com/fdietz/team_dashboard/raw/master/gh-pages/screenshot.png)). It is build to be shown on a big screen in your team's space.

[Heroku hosted Demo](http://team-dashboard.herokuapp.com/)

It has built-in support for [Graphite](http://graphite.wikidot.com/) and makes it really easy to add more input sources.

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
    <td>The values of the selected period are aggregated using selected function. Supports sum, average and delta.</td>
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
    <td>dot notation to select nested value from JSON structure (Example: parent.child.nestedChild.value)</td>
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

## Data Sources

### Datapoints
The datapoints source supports data for rendering graphs and aggregated values. Following a minimal implementation.

    class Example < Sources::Datapoints::Base
      def get(targets, from, to, options = {})
        result = []
        targets.each do |target|
          # retrieve the actual data here
          result << { 'target' => "demo.example1", 'datapoints' => [[1, 123456], [7, 123466]] }
        end
        result
      end

      def available_targets(options = {})
        ["demo.example1", "demo.example2"]
      end

      def supports_target_browsing?
        true
      end
    end

Note the datapoints array consists of pairs of number values (y-value and timestamp for the x-value of the graph). This is similar to how Graphite or Ganglia structure their json data for graph data.

For datapoints sources it makes sense to enable users to browse them easily. The widget editor dialog features an autosuggest textfield. it requires the <code>available_targets</code> method to return an array of strings. Additionally <code>supports_target_browsing?</code> should return true.

### CI (Continous Integration Server)
The CI data source delivers build status results.

    class Demo < Sources::Ci::Base
      def get(server_url, project, options = {})
        {
          :label             => "Demo name",
          :last_build_time   => Time.now.iso8601,
          :last_build_status => 0, # success
          :current_status    => 1  # building
        }
      end
    end

### Number
The number data source supports a single integer value and an optional label.

    class Example < Sources::Number::Base
      def get(options = {})
        # retrieve actual data here
        { :value => 115, :label => "example label" }
      end
    end

### Boolean
The boolean data source supports a single boolean value and an optional label.

    class Example < Sources::Boolean::Base
      def get(options = {})
        # retrieve actual data here
        { :value => true, :label => "example label" }
      end
    end

## Create your own Data Source
Create a data source ruby file under app/models/sources. As long as it extends from the specific base class (for example Sources::Boolean::Base) it will be automatically available.

### Global configuration for your data source
It some cases it makes sense to have a global configuration in the Rails app instead of a separate option as part of the widget configuration.

Let's have a look at how its done for for the Graphite data source. There's an entry in application.rb.

    module TeamDashboard
      class Application < Rails::Application
        config.graphite_url = ENV['GRAPHITE_URL']
      end
    end

Note that it is set to the environment variable GRAPHITE_URL, which makes it easy to set without changing the rails app directly. Additionally, this configuration can be set in the environment specific config files.

The graphite data source now can easily access the configuration. In order to determine if the data source is configured correctly you have to implement the <code>available?</code> method:

    class Graphite < Sources::Datapoints::Base
      def available?
        Rails.configuration.graphite_url.present?
      end
    end

Only if <code>available?</code> returns true will the data source be available in the widget editor.


## HTTP Proxy Source
As described above you can easily add your own data source implementions. On the other hand you might prefer to offer a service on your server instead. The HTTP proxy source requests data on the server side, the Rails app being the "proxy" of the web app. The JSON format for the specific sources is described below.

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