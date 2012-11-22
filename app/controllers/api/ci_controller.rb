module Api
  class CiController < BaseController

    def show
      plugin = Sources.ci_plugin(params[:source])
      result = plugin.get(params)
      if result
        respond_with(result.to_json)
      else
        respond_with({ :message => "No Data available" }.to_json, 500)
      end
    end

  end
end