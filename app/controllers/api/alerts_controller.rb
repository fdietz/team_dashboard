module Api
    class AlertsController < BaseController

        def show
            plugin = Sources.alert_plugin(params[:source])
            result = plugin.get(params)
            respond_with(result.to_json)
        end

    end
end