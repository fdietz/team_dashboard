module Api
  class DatapointsTargetsController < BaseController
    respond_to :json

    def index
      targets = Sources.datapoints_targets_plugin(params[:source]).get(params)
      respond_with targets.inject([]) { |result, m| result << { :name => m } }.to_json
    end

  end
end