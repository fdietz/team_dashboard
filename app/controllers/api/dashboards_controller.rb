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

    def create
      attributes = JSON.parse(request.body.read.to_s).symbolize_keys
      bson_id = SimpleMetrics::DashboardRepository.save(SimpleMetrics::Dashboard.new(attributes))
      new_dashboard = SimpleMetrics::DashboardRepository.find_one(bson_id.to_s)
      render :json => new_dashboard.attributes.to_json, :status => 201
    end

    def update
      attributes = JSON.parse(request.body.read.to_s).symbolize_keys
      dashboard = SimpleMetrics::DashboardRepository.find_one(params[:id])
      dashboard.instruments = attributes[:instruments]
      dashboard.name = attributes[:name]
      SimpleMetrics::DashboardRepository.update(dashboard)
      head :status => 204
    end

    def destroy
      SimpleMetrics::DashboardRepository.remove(params[:id])
      head :status => 204
    end

  end
end