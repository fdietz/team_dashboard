require 'open-uri'

module Sources
  module Datapoints
    class Ganglia < Sources::Datapoints::Base

      def initialize
        @url_builder = GangliaUrlBuilder.new(Rails.configuration.ganglia_url)
      end

      def available?
        Rails.configuration.ganglia_url.present?
      end

      def get(targets, from, to, options = {})
        ganglia_datapoints = request_datapoints(targets, from, to)
        result = []
        targets.each_with_index do |target, index|
          result << { "target" => target, "datapoints" => ganglia_datapoints[index] }
        end
        result
      end

      private

      def request_datapoints(targets, from, to)
        result = []
        targets.each do |target|
          url = @url_builder.datapoints_url(target, from, to)
          Rails.logger.debug("Requesting datapoints from #{url} ...")
          response = ::HttpService.request(url)
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