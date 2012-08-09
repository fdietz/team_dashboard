module Api
  class WidgetsController < BaseController

    def show
      widget = Widget.for_dashboard(params[:dashboard_id]).find(params[:id])

      respond_with(widget)
    end

    def index
      widgets = Widget.for_dashboard(params[:dashboard_id]).all
      respond_with(widgets)
    end

    def create
      dashboard = Dashboard.find(params[:dashboard_id])
      input = JSON.parse(request.body.read.to_s)
      widget = dashboard.widgets.build(Widget.slice_attributes(input))
      if widget.save
        render :json => widget, :status => :created, :location => api_dashboard_widget_url(:dashboard_id => dashboard.id, :id => widget.id)
      else
        render :json => widget.errors, :status => :unprocessable_entity
      end
    end

    def update
      dashboard = Dashboard.find(params[:dashboard_id])
      widget = dashboard.widgets.find(params[:id])
      input = JSON.parse(request.body.read.to_s)
      if widget.update_attributes(Widget.slice_attributes(input))
        head :no_content
      else
        render :json => widget.errors, :status => :unprocessable_entity
      end
    end

    def destroy
      dashboard = Dashboard.find(params[:dashboard_id])
      widget = dashboard.widgets.find(params[:id])
      widget.destroy
      head :no_content
    end

  end
end