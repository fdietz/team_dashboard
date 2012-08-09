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
        JSON.parse(request_datapoints(targets, from, to))
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