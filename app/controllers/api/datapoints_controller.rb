module Api
  class DatapointsController < BaseController

    def show
      from    = params[:from]
      to      = params[:to] || Time.now.to_i
      at      = params[:at]
      targets = params[:targets]
      source  = params[:source]
      aggregate_function = params[:aggregate_function]

      handler = Sources.datapoints_plugin_class(source).new
      datapoints = handler.get(targets, from.to_i, to.to_i)
      respond_with datapoints.to_json
    end

  end
end