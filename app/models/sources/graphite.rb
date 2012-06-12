require 'open-uri'

module Sources
  class Graphite < Base
    def initialize(options = {})
      @graphite_url = options.fetch(:graphite_url)
    end
    
    def metrics
      uri = URI.parse("#{@graphite_url}/metrics/index.json")
      Rails.logger.debug("Requesting metrics from #{uri} ...")
      JSON.parse(uri.read)
    end

    def datapoints(targets, time = 'minute')
      target_params = Array(targets).map { |t| "target=#{t}" }.join('&')
      uri = URI.parse("#{@graphite_url}/render?#{target_params}&format=json&from=#{from(time)}")
      Rails.logger.debug("Requesting datapoints from #{uri} ...")
      JSON.parse(uri.read)
    end

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