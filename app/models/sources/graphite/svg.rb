require "net/http"

#
# Configure the Graphite URL in application.rb:
#   config.graphite_url = ENV['GRAPHITE_URL']
#
# or use and environment variable:
#   GRAPHITE_URL=http://localhost:8080 rails s
#
# Target Selection:
#   You can pass a semicolon-separated list of targets:
#
#   example: visits.server1; visits.server2).
#
#   It also supports wildcards:
#
#   example: visits.server.*).
#
module Sources
  module Graphite
    class Svg < Sources::Graphite::Base

      def initialize
        @url_builder = GraphiteUrlBuilder.new(BackendSettings.graphite.url)
      end

      def available?
        BackendSettings.graphite.enabled?
      end

      def supports_target_browsing?
        true
      end

      def supports_functions?
        true
      end

      def get(options = {})
        from         = (options[:from]).to_i
        to           = (options[:to] || Time.now).to_i
        widget       = Widget.find(options.fetch(:widget_id))
        targets      = targetsArray(widget.settings.fetch(:targets))

        result = request_datapoints(targets, from, to, options)
        raise Sources::Datapoints::NotFoundError if result.empty?
        result
      end

      def available_targets(options = {})
        pattern = options[:pattern]
        limit   = (options[:limit] || 200).to_i

        cached_result = cached_get("graphite") do
          request_available_targets
        end

        result = pattern.present? ? cached_result.reject { |target| target !~ /#{pattern}/ }  : cached_result
        # remove "." prefix in target name when used with graphite 0.9.10
        result.each { |target| target.gsub!(/^\./, '') }

        result.slice(0, limit)
      end

      private

      def request_datapoints(targets, from, to, options = {})
        url = @url_builder.datapoints_svg_url(targets, from, to, options)

        #
        # temporary using net/http directly until array param encoding is handled correctly
        # (https://github.com/technoweenie/faraday/issues/78 and https://github.com/technoweenie/faraday/pull/186)
        #
        # ::HttpService.request(hash[:url], :params => hash[:params])
        #

        Rails.logger.debug("Requesting url: #{url}")

        uri = URI.parse(url)
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true if uri.scheme == 'https'
        request = Net::HTTP::Get.new(uri.request_uri)
        request.basic_auth(CGI.unescape(uri.user), CGI.unescape(uri.password)) if uri.user && uri.password
        response = http.request(request)

        { :content => response.body }
      rescue JSON::ParserError => e
        Rails.logger.error("Graphite JSON::ParserError: #{e}")
        raise Sources::Datapoints::Error.new, extract_error(response.body)
      end

      def extract_error(body)
        match = body[/.*(Assertion|Type|Key)Error.*/]
        case match
        when /Assertion/
          "Graphite #{match}"
        when /Type/
          "Graphite #{match}"
        when /Key/
          "Graphite #{match}\nCheck if you have a typo in a function name or other syntax error"
        else
          match
        end
      end

      def request_available_targets
        url = @url_builder.metrics_url
        Rails.logger.debug("Requesting available targets from #{url} ...")
        ::HttpService.request(url)
      end
    end
  end
end
