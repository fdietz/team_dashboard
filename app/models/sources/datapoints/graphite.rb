require 'open-uri'

module Sources
  module Datapoints
    class Graphite < Sources::Datapoints::Base

      def initialize
        @url_builder = GraphiteUrlBuilder.new(Rails.configuration.graphite_url)
      end

      def get(targets, from, to, aggregate_function = nil)
        result = JSON.parse(request_datapoints(targets, from, to))
        if aggregate_function
          [{ 'target' => 'aggregated targets', 'datapoints' => [[aggregated_result(result, aggregate_function), to]]}]
        else
          result
        end
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