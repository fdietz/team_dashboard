module Api
  class DatapointsController < BaseController

    def show
      from    = (params[:from]  || Time.now).to_i
      time    = params[:time]   || 'minute'
      targets = params[:targets]
      data_points = prepare_data_points(from, time, *targets)
      respond_with data_points.to_json
    end

    private

    def prepare_data_points(from, time, *targets)
      bucket = SimpleMetrics::Bucket.for_time(time)
      to = from - SimpleMetrics::Graph.time_range(time)
      results = SimpleMetrics::Graph.query_all(bucket, to, from, *targets)
      results.each do |result|
        result[:target] = result[:name]
        result[:datapoints] = result[:data].map do |data|
          [data[:y], data[:x]]
        end
        result[:data] = nil
        result[:name] = nil
      end
    end

  end
end