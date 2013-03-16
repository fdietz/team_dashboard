# HTTP Proxy Source

As described in the [data source plugin guide](SOURCE_PLUGINS.markdown) you can easily add your own data source implementions.

On the other hand you might prefer to offer a service on your server instead. The HTTP proxy source requests data on the server side, the Rails app being the "proxy" of the web app. The JSON format for the specific sources is described below.

## HTTP Proxy URL
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
