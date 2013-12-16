# Source Plugins

All source plugins have a system wide and an widget specific configuration.

System wide configuration can be found in `RAILS_ROOT/config/application.rb` and can set via environment variables for Rails:

    GRAPHITE_URL=http://localhost:8080 rails s

The widget specific configuration is done when creating widgets in the Rails app.

All widgets have the same set of required parameters in common:

* name
* kind (Widget type, for example: "number", "boolean", "graph", etc.)
* source (Source Plugin, for example: "demo", "sensu")
* update_interval
* dashboard_id

Additionally, all source plugins can specify additional parameters which are listed below for each source plugin grouped by widget.

The source plugins reside in [RAILS_ROOT/app/models/sources](https://github.com/fdietz/team_dashboard/tree/master/app/models/sources), grouped by widget.

## Alert Widget

### Sensu

##### Configuration
* sensu_events (SENSU_EVENTS_URL)

##### Widget Parameters
* sensu_clients (optional)
* ignored_checks (optional)

## Boolean Widget

### HTTP Proxy
##### Configuration
No configuration required.

##### Widget Parameters
* http_proxy_path (mandatory)

##### Expected JSON response format

    {
      "value": true,
      "label": "Hello World"
    }

### NodeJS Uptime
##### Configuration
* uptime_url (UPTIME_URL)

##### Widget Parameters
* check_name (mandatory)

### Pingdom
##### Configuration
No configuration required.

##### Widget Parameters
* user (mandatory)
* password (mandatory)
* key (mandatory)
* check (mandatory)

### Shell Script

##### Configuration
No configuration required.

##### Widget Parameters
* command (mandatory)

## CI Widget
### Jenkins
##### Configuration
No configuration required.

##### Widget Parameters
* server_url (mandatory)
* project (mandatory)

### Travis CI
##### Configuration
No configuration required.

##### Widget Parameters
* server_url (mandatory)
* project (mandatory)

## Graph Widget
### Ganglia
##### Configuration
* ganglia_web_url (GANGLIA_WEB_URL)
* ganglia_host (GANGLIA_HOST)

##### Widget Parameters
* targets (mandatory)

### Graphite
##### Configuration
* graphite_url (GRAPHITE_URL)

##### Widget Parameters
* targets (mandatory)

### HTTP Proxy
##### Configuration
No configuration required.

##### Widget Parameters
* http_proxy_path (mandatory)
* targets (mandatory)

##### Expected JSON response format

    [
      {
        "target": "First target",
        "datapoints": [[1, 2], [2, 3], [4, 6]]
      },
      {
        "target": "Second target",
        "datapoints": [[1, 2], [2, 3], [4, 6]]
      }
    ]

## Graphite Widget
### SVG
##### Configuration
* graphite_url (GRAPHITE_URL)

##### Widget Parameters
* targets (mandatory)

## Exception Tracker
### Errbit
##### Configuration
No configuration required.

##### Widget Parameters
* server_url (mandatory)
* api_key (mandatory)

## Number Widget
### Datapoints (same as used by Graph Widget)
### Hockey App
##### Configuration
No configuration required.

##### Widget Parameters
* app_identifier (mandatory)
* app_token (mandatory)

### HTTP Proxy
### Jenkins Game
##### Configuration
No configuration required.

##### Widget Parameters
* url (mandatory)
* user_name (mandatory)

### Jira Filter Counter

##### Configuration
* jira_url (JIRA_URL)
* jira_user (JIRA_USER)
* jira_password (JIRA_PASSWORD)

##### Widget Parameters
* filter_id

Create a Search Filter in your Jira installation and remember the Filter ID (`requestId` in URL when viewing the filter)

### New Relic
##### Configuration
No configuration required.

##### Widget Parameters
* api_key (mandatory)
* value_name (mandatory)

### Pingdom Response Time
##### Configuration
No configuration required.

##### Widget Parameters
* user (mandatory)
* password (mandatory)
* key (mandatory)
* check (mandatory)

## Status Table
### HTTP Proxy
##### Configuration
No configuration required.

##### Widget Parameters
* http_proxy_path (mandatory)

##### Expected JSON response format

    [
      {
        "label": "Curabitur condimentum leo",
        "value": "2013/03/11",
        "status": 2
      },
      {
        "label": "Lorem ipsum dolor sit amet",
        "value": "2013/05/15",
        "status": 2
      }
    ]


### JSON File
##### Configuration
No configuration required.

##### Widget Parameters
* input_file (mandatory)

##### Expected JSON response format

    [
      {
        "label": "Curabitur condimentum leo",
        "value": "2013/03/11",
        "status": 2
      },
      {
        "label": "Lorem ipsum dolor sit amet",
        "value": "2013/05/15",
        "status": 2
      }
    ]
