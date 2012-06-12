module Api
  class MetricsController < ApplicationController
    respond_to :json
    
    def index
      metrics = Sources.handler(Rails.configuration.source).metrics
      respond_with metrics.inject([]) { |result, m| result << { :name => m } }.to_json
    end

  end
end