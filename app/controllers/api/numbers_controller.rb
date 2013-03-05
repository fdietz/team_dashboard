module Api
  class NumbersController < BaseController

    def show
      plugin = Sources.number_plugin(params[:source])
      result = plugin.get(params)
      respond_with(result.to_json)
    end

  end
end