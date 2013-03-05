module Api
  class CiController < BaseController

    def show
      plugin = Sources.ci_plugin(params[:source])
      result = plugin.get(params)
      respond_with(result.to_json)
    end

  end
end