require 'open-uri'

module Sources
  class Graphite < Base
    def initialize(options = {})
      @graphite_url = options.fetch(:graphite_url)
    end
    
    def metrics
      JSON.parse(request_metrics)
    end

    # def datapoints(targets, time = 'minute')
    #   JSON.parse(request_datapoints(time))
    # end

    def datapoints(targets, from, to = nil)
      to ||= Time.now 
      JSON.parse(request_datapoints(from, to))
    end

    def request_metrics
      uri = URI.parse("#{@graphite_url}/metrics/index.json")
      Rails.logger.debug("Requesting metrics from #{uri} ...")
      uri.read
    end

    def request_datapoints(from, to)
      uri = URI.parse("#{@graphite_url}/render?#{target_params}&format=json&from=#{format(from)}&until=#{format(to)}")
      Rails.logger.debug("Requesting datapoints from #{uri} ...")
      uri.read
    end

    def format(timestamp)
      time = Time.at(timestamp)
      time.strftime("%H:%M_%Y%m%d")
    end

    def target_params
      Array(targets).map { |t| "target=#{t}" }.join('&')
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