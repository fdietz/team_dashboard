module Api
  class DataSourcesController < BaseController

    def index
      plugin = Sources.plugin_clazz(params[:kind], params[:source])
      puts params
      result = plugin.new.get(params)
      respond_with(result.to_json)
    end

  end
end