module Api
  class MetricsController < ApplicationController

    respond_to :json
    
    # by name
    def show
      metric = SimpleMetrics::MetricRepository.find_one_by_name(params[:name])
      respond_with metric.attributes.to_json
    end

    def index
      metrics = SimpleMetrics::MetricRepository.find_all
      respond_with metrics.inject([]) { |result, m| result << m.attributes }.to_json
    end

  end
end