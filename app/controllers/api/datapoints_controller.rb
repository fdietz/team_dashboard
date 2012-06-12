module Api
  class DatapointsController < BaseController

    def show
      from    = (params[:from]  || Time.now).to_i
      time    = params[:time]   || 'minute'
      targets = params[:targets]
      datapoints = Sources.handler(Rails.configuration.source).datapoints(targets, time)
      respond_with datapoints.to_json
    end

  end
end