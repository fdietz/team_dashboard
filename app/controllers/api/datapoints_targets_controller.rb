module Api
  class DatapointsTargetsController < BaseController
    respond_to :json

    def index
      targets = Sources.datapoints_plugin(params[:source]).available_targets(params)
      targets_fixed = []
      targets.each { |target| targets_fixed.push(target.gsub(/^\./, '')) }
      #respond_with targets.inject([]) { |result, m| result << { :name => m } }.to_json
      respond_with targets_fixed.inject([]) { |result, m| result << { :name => m } }.to_json
    end

  end
end