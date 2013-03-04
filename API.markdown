# Team Dashboard REST API
Of course there's a REST API for accessing the dashboard and widget configuration.

## Dashboard

### GET /api/dashboards
Retrieve list of all dashboards

Example:

    curl -H "Accept: application/json" http://localhost:3000/api/dashboards

### GET /api/dashboards/id
Retrieve details of specific dashboard

Example URL:

    curl -H "Accept: application/json" http://localhost:3000/api/dashboards/1

Example Response:

    {
      created_at: 2012-09-05T08:38:09Z
      id: 2
      layout: [
        4
        5
        6
        7
      ]
      name: Example 2 (Counters, Numbers, Boolean and Graph Widgets)
      updated_at: 2012-09-05T08:38:10Z
    }

### POST /api/dashboards
Creates a new dashboard.

Example:

  curl -v -H "Content-type: application/json" -X POST -d '{ "name": "test" }' http://localhost:3000/api/dashboards

### DELETE /api/dashboards/id
Deletes a specific dashboard

Example:

  curl -X DELETE http://localhost:3000/api/dashboards/1

## Widget


### GET /api/dashboards/id/widgets
Retrieve list of all widgets for specific dashboards

Example:

    curl -H "Accept: application/json" http://localhost:3000/api/dashboards/1/widgets

### GET /api/dashboards/id/widgets/id
Retrieve details of specific widgets for specific dashboards

Example:

    curl -H "Accept: application/json" http://localhost:3000/api/dashboards/1/widgets/1

Example Response:

    {
      created_at: 2012-09-05T11:44:34Z
      dashboard_id: 1
      id: 9
      kind: graph
      name: Undefined name
      range: 30-minutes
      size: 1
      source: demo
      targets: demo.example1
      update_interval: 10
      updated_at: 2012-09-05T11:44:34Z
      graph_type: line
    }

### POST /api/dashboards/id/widgets
Creates widget for specific dashboard

Example:

    curl -v -H "Content-type: application/json" -X POST -d '{ "name": "test", "source": "demo" }' http://localhost:3000/api/dashboards/1/widgets


### DELETE /api/dashboards/id/widgets/id
Deletes specific widget

Example:

    curl -X DELETE http://localhost:3000/api/dashboards/1/widgets/1
