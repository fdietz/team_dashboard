module Api
  class CountersController < BaseController

    def show
      from    = params[:from]
      to      = params[:to] || Time.now.to_i
      targets = params[:targets]
      source  = params[:source]
      aggregate_function = params[:aggregate_function]

      plugin = Sources.datapoints_plugin(source)
      datapoints = plugin.get(targets, from.to_i, to.to_i)
      result = { :value => Aggregation.aggregated_result(datapoints, aggregate_function) }

      respond_with result.to_json
    end

  end
end