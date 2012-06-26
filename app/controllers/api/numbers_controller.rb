module Api
  class NumbersController < BaseController

    def show
      plugin = Sources.number_plugin(params[:source])
      count = plugin.get
      respond_with({ :value => count }.to_json)
    end

  end
end