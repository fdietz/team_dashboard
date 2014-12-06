module Api
  class DashboardsController < BaseController

    def show
      dashboard = Dashboard.find(params[:id])
      respond_with dashboard
    end

    def index
      dashboards = Dashboard.order("NAME ASC")
      respond_with dashboards
    end

    def create
      # fixed on rails master (remove after 4.0.1 release)
      request.body.rewind
      input = JSON.parse(request.body.read)
      dashboard = Dashboard.new(dashboard_params(input))
      if dashboard.save
        render :json => dashboard, :status => :created, :location => api_dashboards_url(dashboard)
      else
        render :json => dashboard.errors, :status => :unprocessable_entity
      end
    end

    def update
      dashboard = Dashboard.find(params[:id])
      # fixed on rails master (remove after 4.0.1 release)
      request.body.rewind
      input = JSON.parse(request.body.read)
      if dashboard.update_attributes(dashboard_params(input))
        render :json => dashboard
      else
        render :json => dashboard.errors, :status => :unprocessable_entity
      end
    end

    def destroy
      Dashboard.destroy(params[:id])
      head :no_content
    end

    protected

    def dashboard_params(input)
      result = input.slice(*%w(name time layout locked))
      result['name'] and result['name'].strip!
      result
    end
  end
end
