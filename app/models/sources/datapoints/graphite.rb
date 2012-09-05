require "net/http"

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

      def supports_functions?
        true
      end

      def get(targets, from, to, options = {})
        result = request_datapoints(targets, from, to)
        raise Sources::Datapoints::NotFoundError if result.empty?
        result
      end

      def available_targets(options = {})
        request_available_targets
      end

      private

      def request_datapoints(targets, from, to)
        hash = @url_builder.datapoints_url(targets, from, to)
        Rails.logger.debug("Requesting datapoints from #{hash[:url]} with params #{hash[:params]} ...")

        #
        # temporary using net/http directly until array param encoding is handled correctly
        # (https://github.com/technoweenie/faraday/issues/78 and https://github.com/technoweenie/faraday/pull/186)
        #
        # ::HttpService.request(hash[:url], :params => hash[:params])
        #
        
        url = build_query(hash)
        Rails.logger.debug("Requesting url: #{url}")

        uri = URI.parse(url)
        http = Net::HTTP.new(uri.host, uri.port)
        request = Net::HTTP::Get.new(uri.request_uri)
        request.basic_auth(CGI.unescape(uri.user), CGI.unescape(uri.password)) if uri.user && uri.password
        response = http.request(request)

        JSON.parse(response.body)
      end

      def build_query(hash)
        targets = hash[:params][:target].reject(&:blank?).map { |t| "target=#{CGI.escape(t)}" }
        query = ["from=#{CGI.escape(hash[:params][:from])}", "until=#{CGI.escape(hash[:params][:until])}", "format=json"] + targets
        "#{hash[:url]}?#{query.join('&')}"
      end

      def request_available_targets
        url = @url_builder.metrics_url
        Rails.logger.debug("Requesting available targets from #{url} ...")
        ::HttpService.request(url)
      end
    end
  end
end
