require 'open-uri'

module Sources
  module Number
    class Graphite < Sources::Number::Base

      def initialize
        @url_builder = GraphiteUrlBuilder.new(Rails.configuration.graphite_url)
      end

      def datapoints_at(targets, aggregate_function, at)
        result = JSON.parse(request_datapoints(targets, at, at))
        dps = result.map { |r| latest_datapoint(r['datapoints']) }
        aggregate(dps, aggregate_function)
      end

      private

      def request_datapoints(targets, from, to)
        uri = URI.parse(@url_builder.datapoints_url(targets, from, to))
        Rails.logger.debug("Requesting datapoints from #{uri} ...")
        uri.read
      end

    end
  end
end