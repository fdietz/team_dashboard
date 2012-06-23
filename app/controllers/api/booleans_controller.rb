module Api
  class BooleansController < BaseController

    def show
      source  = params[:source]

      handler = Sources.boolean_plugin_class(source).new
      boolean = handler.datapoints_at(targets, aggregate_function, at.to_i)
      respond_with({ :value => boolean }.to_json)
    end

  end
end