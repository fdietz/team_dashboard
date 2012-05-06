module Api
  class DashboardsController < ApplicationController

    respond_to :json
    
    def show
      dashboard = SimpleMetrics::DashboardRepository.find_one(params[:id])
      respond_with dashboard.attributes.to_json
    end

    def index
      dashboards = SimpleMetrics::DashboardRepository.find_all
      respond_with dashboards.inject([]) { |result, m| result << m.attributes }.to_json
    end

  end
end