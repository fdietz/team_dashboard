module Api
  class DatapointsController < BaseController

    def show
      from    = params[:from]
      to      = params[:to] || Time.now.to_i
      at      = params[:at]
      targets = params[:targets]

      puts "===== from: #{from}, to: #{to}, at: #{at}"
      handler = Sources.handler(Rails.configuration.source)
      datapoints = if at
        handler.datapoint(targets, at.to_i)
      else
        handler.datapoints(targets, from.to_i, to.to_i)
      end
      respond_with datapoints.to_json
    end

  end
end