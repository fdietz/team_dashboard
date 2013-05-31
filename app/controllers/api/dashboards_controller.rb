module Api
  class DashboardsController < BaseController

    def show
      dashboard = Dashboard.find(params[:id])
      respond_with dashboard
    end

    def index
      dashboards = Dashboard.order("NAME ASC").all
      respond_with dashboards
    end

    def create
      input = JSON.parse(request.body.read.to_s)
      dashboard = Dashboard.new(input.slice(*Dashboard.accessible_attributes))
      if dashboard.save
        render :json => dashboard, :status => :created, :location => api_dashboards_url(dashboard)
      else
        render :json => dashboard.errors, :status => :unprocessable_entity
      end
    end

    def update
      dashboard = Dashboard.find(params[:id])
      input = JSON.parse(request.body.read.to_s)
      if dashboard.update_attributes(input.slice(*Dashboard.accessible_attributes))
        render :json => dashboard
      else
        render :json => dashboard.errors, :status => :unprocessable_entity
      end
    end

    def destroy
      Dashboard.destroy(params[:id])
      head :no_content
    end

  end
end