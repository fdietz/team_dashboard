module Api
  class MetricsController < ApplicationController
    respond_to :json
    
    def index
      targets = Sources.targets_plugin(params[:source]).targets
      respond_with targets.inject([]) { |result, m| result << { :name => m } }.to_json
    end

  end
end