module Api
  class DatapointsController < BaseController

    def show
      from    = params[:from]
      to      = params[:to] || Time.now.to_i
      targets = params[:targets]
      source  = params[:source]
      aggregate_function = params[:aggregate_function]

      plugin = Sources.datapoints_plugin(source)
      datapoints = plugin.get(targets, from.to_i, to.to_i)

      if aggregate_function
        datapoints = [
          { 'target'     => 'aggregated targets',
            'datapoints' => [[Aggregation.aggregated_result(datapoints, aggregate_function), to]]
          }
        ]
      end

      respond_with datapoints.to_json
    end

  end
end