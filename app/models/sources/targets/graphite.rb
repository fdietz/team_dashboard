require 'open-uri'

module Sources
  module Targets
    class Graphite < Sources::Targets::Base

      def initialize
        @url_builder = GraphiteUrlBuilder.new(Rails.configuration.graphite_url)
      end

      def available?
        Rails.configuration.graphite_url.present?
      end

      def targets
        JSON.parse(request_metrics)
      end

      private

      def request_metrics
        uri = URI.parse(@url_builder.metrics_url)
        Rails.logger.debug("Requesting metrics from #{uri} ...")
        uri.read
      end

    end
  end
end