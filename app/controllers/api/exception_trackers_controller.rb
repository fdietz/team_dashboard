module Api
  class ExceptionTrackersController < BaseController

    def show
      plugin = Sources.exception_tracker_plugin(params[:source])
      result = plugin.get(params)
      respond_with(result.to_json)
    end

  end
end