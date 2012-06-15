module Sources
  class SimpleMetrics < Base
    def initialize(options = {})
    end
    
    def metrics
      metrics = ::SimpleMetrics::MetricRepository.find_all
      metrics.inject([]) { |result, m| result << m.attributes[:name] }
    end

    # TODO: fix me
    def datapoints(targets, from, to = nil)
      from = Time.now.to_i
      bucket = ::SimpleMetrics::Bucket.for_time(time)
      to = from - ::SimpleMetrics::Graph.time_range(time)
      results = ::SimpleMetrics::Graph.query_all(bucket, to, from, *targets)
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