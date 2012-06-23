module Api
  class NumbersController < BaseController

    def show
      at      = params[:at]
      targets = params[:targets]
      source  = params[:source]
      aggregate_function = params[:aggregate_function]

      handler = Sources.number_plugin_class(source).new
      count = handler.get(targets, aggregate_function, at.to_i)
      respond_with({ :value => count }.to_json)
    end

  end
end