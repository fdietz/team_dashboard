module Api
  class GraphController < ApplicationController

    respond_to :json
    
    def show
      from    = (params[:from]  || Time.now).to_i
      time    = params[:time]   || 'minute'
      targets = params[:targets]
      data_points = prepare_data_points(from, time, *targets)
      puts data_points.to_json
      respond_with data_points.to_json
    end

    private

    def prepare_data_points(from, time, *targets)
      bucket = SimpleMetrics::Bucket.for_time(time)
      to = from - SimpleMetrics::Graph.time_range(time)
      SimpleMetrics::Graph.query_all(bucket, to, from, *targets)
    end

  end
end