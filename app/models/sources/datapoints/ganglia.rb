require 'xml'
require 'open-uri'

module Sources
  module Datapoints
    class Ganglia < Sources::Datapoints::Base

      PORT = 8649

      def initialize
        @url_builder = GangliaUrlBuilder.new(Rails.configuration.ganglia_web_url)
      end

      def available?
        Rails.configuration.ganglia_web_url.present? && Rails.configuration.ganglia_host.present?
      end

      def get(targets, from, to, options = {})
        ganglia_datapoints = request_datapoints(targets, from, to)
        result = []
        targets.each_with_index do |target, index|
          result << { "target" => target, "datapoints" => ganglia_datapoints[index] }
        end
        result
      end

      def available_targets(options = {})
        xml = request_available_targets
        parse_targets(xml)
      end

      def supports_target_browsing?
        true
      end

      private

      def parse_targets(xml)
        targets = []
        source = XML::Parser.string(xml)
        content = source.parse
        hosts = content.root.find('//CLUSTER/HOST')
        cluster = content.root.find_first('//CLUSTER').attributes['NAME']
        hosts.each do |host|
          host.find('./METRIC').each do |metric|
            targets << "#{host.attributes['NAME']}@#{cluster}(#{metric.attributes['NAME']})"
          end
        end
        targets
      end

      def request_available_targets
        Rails.logger.debug("Requesting available targets from #{Rails.configuration.ganglia_host}:#{PORT} ...")
        client = TCPSocket.open(Rails.configuration.ganglia_host, PORT)
        result = ""
        while line = client.gets
          result << line.chop
        end
        client.close
        result
      end

      def request_datapoints(targets, from, to)
        result = []
        targets.each do |target|
          hash = @url_builder.datapoints_url(target, from, to)
          Rails.logger.debug("Requesting datapoints from #{hash[:url]} with params #{hash[:params]} ...")
          response = ::HttpService.request(hash[:url], :params => hash[:params])
          if response == "null"
            result << []
          else
            result << response.first["datapoints"]
          end
        end
        result
      end

    end
  end
end