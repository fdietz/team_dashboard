module Api
  class NumbersController < BaseController

    def show
      plugin = Sources.number_plugin(params[:source])
      result = plugin.get(params)
      if result
        respond_with(result.to_json)
      else
        head 500
      end
    end

  end
end