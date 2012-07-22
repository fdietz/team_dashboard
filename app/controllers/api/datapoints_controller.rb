module Api
  class DatapointsController < BaseController

    def show
      from    = params[:from]
      to      = params[:to] || Time.now.to_i
      targets = params[:targets]
      source  = params[:source]

      plugin = Sources.datapoints_plugin(source)
      datapoints = plugin.get(targets, from.to_i, to.to_i, params)

      respond_with datapoints.to_json
    end

  end
end