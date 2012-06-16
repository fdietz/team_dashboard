module Api
  class DatapointsController < BaseController

    def show
      from    = params[:from]
      to      = params[:to] || Time.now.to_i
      at      = params[:at]
      targets = params[:targets]
      source  = params[:source]
      aggregate_function = params[:aggregate_function]

      handler = Sources.handler(source)
      datapoints = if at
        handler.datapoints_at(targets, aggregate_function, at.to_i)
      else
        handler.datapoints(targets, from.to_i, to.to_i)
      end
      respond_with datapoints.to_json
    end

  end
end