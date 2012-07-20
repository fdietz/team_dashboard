# Team Dashboard

Team Dashboard lets you visualize your team's metrics all in one place.

This beta version leverages Graphite as the first input source to display graphs and other widgets.

It is implemented as a Rails app and uses MySQL to store your custom dashboards.

## Getting Started

Clone the repository:

    git clone git://github.com/fdietz/team_dashboard.git

Run bundler:

    bundle install

Create the database and run migrations:

    rake db:create
    rake db:migrate

There is an initial "Demo" source and sample dashboards provided. Generate these via:

    rake populate

Start the Rails server:

    rails s

## Configuration

You have to configure the MySQL database in config/database.yml.

Graphite is the first input source Team Dashboard supports. Use the environment variable GRAPHITE_URL or change the rails configuration (see application.rb and environment specific files) directly.

    GRAPHITE_URL=http://mygraphiteserver

For example:

    GRAPHITE_URL=http://localhost:8080 rails s

# Dashboard Widgets

A dashboard in Team Dashboard consists of multiple Widgets, which request data from a data source via AJAX request.

All widgets have a name, time interval in which to update themselves and a data source as a common configuration.

## Available Widgets

### Graph Widget
The graph widget shows a time series line graph (using rickshaw.js internally). Use it to show number of visits on your web page or number of currently online users and follow-up on trends.

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
    <td>Only "demo" and "graphite" currently supported.</td>
  </tr>
  <tr>
    <td>Targets</td>
    <td>Comma-separated targets. Also supports wildcards (example: visits.server.*).</td>
  </tr>
</table>

### Counter Widget
Shows the current value and the percentage of change of the last period. It is based on time series data and uses the same data sources as the graph widget. The widgets supports showing two values. Use it to for example show the current number of online users.

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
    <td>Only "demo" and "graphite" currently supported.</td>
  </tr>
  <tr>
    <td>Targets</td>
    <td>Comma-separated targets. Also supports wildcards (example: visits.server.*).</td>
  </tr>
  <tr>
    <td>Aggregate Function</td>
    <td>The values of the selected period are aggregated using selected function. Supports sum, average and delta.</td>
  </tr>
</table>

### Number Widget
Shows the current integer value provided by the data source and a label. The widget supports up to three values. Use it to show for the example the number of errors on specific system.

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
</table>

### Boolean Widget
Shows the current boolean value provided by the data source and an label. The widget supports up to three values. Use it to show for example the success of a Jenkins build.

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
</table>

## Data Sources

### Datapoints
The datapoints source supports data for rendering graphs and aggregated values. Following a minimal implementation.

    class Example < Sources::Datapoints::Base
      def get(targets, from, to)
        result = []
        targets.each do |target|
          # retrieve the actual data here
          result << { 'target' => "demo.example1", 'datapoints' => [[1, 123456], [1, 123466]] }
        end
        result
      end
    end

Note the datapoints array consists of pairs of number values (y-value and timestamp for the x-value of the graph). This is similar to how Graphite or Ganglia structure their json data for graph data.

### Number
The number data source supports a single integer value.

    class Example < Sources::Number::Base
      def get
        # retrieve actual data here
        115
      end
    end

### Boolean
The boolean data source supports a single boolean value.

    class Example < Sources::Boolean::Base
      def get
        # retrieve actual data here
        true
      end
    end

## Create your own Data Source

Create a data source ruby file under app/models/sources. As long as it extends from the specific base class (for example Sources::Boolean::Base) it will be automatically available.

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