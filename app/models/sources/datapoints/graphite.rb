require 'open-uri'

module Sources
  module Datapoints
    class Graphite < Sources::Datapoints::Base

      def initialize
        @url_builder = GraphiteUrlBuilder.new(Rails.configuration.graphite_url)
      end

      def available?
        Rails.configuration.graphite_url.present?
      end

      def supports_target_browsing?
        true
      end

      def get(targets, from, to, options = {})
        request_datapoints(targets, from, to)
      end

      def available_targets(options = {})
        request_available_targets
      end

      private

      def request_datapoints(targets, from, to)
        url = @url_builder.datapoints_url(targets, from, to)
        Rails.logger.debug("Requesting datapoints from #{url} ...")
        ::HttpService.request(url)
      end

      def request_available_targets
        url = @url_builder.metrics_url
        Rails.logger.debug("Requesting available targets from #{url} ...")
        ::HttpService.request(url)
      end
    end
  end
end
