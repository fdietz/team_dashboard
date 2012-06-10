module Api
  class MetricsController < ApplicationController
    respond_to :json
    
    def index
      metrics = SimpleMetrics::MetricRepository.find_all
      respond_with metrics.inject([]) { |result, m| result << m.attributes }.to_json
    end

  end
end