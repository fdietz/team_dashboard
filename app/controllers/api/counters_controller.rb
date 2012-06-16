module Api
  class CountersController < BaseController

    def show
      at      = params[:at]
      targets = params[:targets]
      source  = params[:source]
      aggregate_function = params[:aggregate_function]

      handler = Sources.handler(source)
      count = handler.datapoints_at(targets, aggregate_function, at.to_i)
      respond_with({ :value => count }.to_json)
    end

  end
end