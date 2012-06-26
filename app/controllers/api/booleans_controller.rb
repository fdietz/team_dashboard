module Api
  class BooleansController < BaseController

    def show
      handler = Sources.boolean_plugin(params[:source])
      boolean = handler.get
      respond_with({ :value => boolean }.to_json)
    end

  end
end