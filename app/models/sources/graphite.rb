require 'open-uri'

module Sources
  class Graphite < Base

    def initialize(options = {})
      @graphite_url = options.fetch(:graphite_url)
      @url_builder = UrlBuilder.new(@graphite_url)
    end
    
    def metrics
      JSON.parse(request_metrics)
    end

    def datapoints(targets, from, to = nil)
      JSON.parse(request_datapoints(targets, from, to || Time.now.to_i ))
    end

    def datapoint(target, at)
      result = JSON.parse(request_datapoints(target, at, at))
      latest_datapoint(result.first['datapoints'])
    end

    class UrlBuilder
      def initialize(graphite_url)
        @graphite_url = graphite_url
      end

      def datapoints_url(targets, from, to)
        "#{@graphite_url}/render?#{target_params(targets)}&format=json&from=#{format(from)}&until=#{format(to)}"
      end

      def format(timestamp)
        time = Time.at(timestamp)
        time.strftime("%H:%M_%Y%m%d")
      end

      def target_params(targets)
        Array(targets).map { |t| "target=#{t}" }.join('&')
      end
    end

    private

    def latest_datapoint(dps)
      dps.reject { |dp| dp.first.nil? }.sort { |a, b| b.last <=> a.last }.first
    end

    def request_metrics
      uri = URI.parse("#{@graphite_url}/metrics/index.json")
      Rails.logger.debug("Requesting metrics from #{uri} ...")
      uri.read
    end

    def request_datapoints(targets, from, to)
      uri = URI.parse(@url_builder.datapoints_url(targets, from, to))
      Rails.logger.debug("Requesting datapoints from #{uri} ...")
      uri.read
    end

    # TODO: move to client
    def from(time)
      case(time)
      when 'minute'
        '-10min'
      when 'hour'
        '-1h'
      when 'day'
        '-1d'
      when 'week'
        "-7d"
      end
    end
  end
end