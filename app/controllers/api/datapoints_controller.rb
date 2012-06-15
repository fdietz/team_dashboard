module Api
  class DatapointsController < BaseController

    def show
      from    = params[:from]
      to      = params[:to] || Time.now
      at      = params[:at]
      targets = params[:targets]

      handler = Sources.handler(Rails.configuration.source)
      datapoints = if at
        handler.datapoint(targets, at)
      else
        handler.datapoints(targets, from, to)
      end
      respond_with datapoints.to_json
    end

  end
end