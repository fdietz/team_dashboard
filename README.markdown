# Team Dashboard

Team Dashboard lets you visualize your team's metrics all in one place. 

This beta version leverages Graphite as the first input source to display graphs and other widgets.

It is implemented as a Rails app and uses MySQL to store your custom dashboards.

## Getting Started

Clone the repository:

    git://github.com/fdietz/team_dashboard.git

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