module Api
  class DashboardsController < BaseController

    def show
      dashboard = Dashboard.find(params[:id])
      puts "========= #{dashboard.inspect}"
      respond_with dashboard
    end

    def index
      dashboards = Dashboard.all
      respond_with dashboards
    end

    def create
      dashboard = Dashboard.new(JSON.parse(request.body.read.to_s))
      if dashboard.save
        render :json => dashboard, :status => :created, :location => dashboards_url(dashboard)
      else
        render :json => dashboard.errors, :status => :unprocessable_entity
      end
    end

    def update
      dashboard = Dashboard.find(params[:id])
      if dashboard.update_attributes(JSON.parse(request.body.read.to_s))
        head :no_content
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