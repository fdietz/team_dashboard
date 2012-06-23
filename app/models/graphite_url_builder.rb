class GraphiteUrlBuilder

  def initialize(graphite_url)
    @graphite_url = graphite_url
  end

  def datapoints_url(targets, from, to)
    "#{@graphite_url}/render?#{target_params(targets)}&format=json&from=#{format(from)}&until=#{format(to)}"
  end

  def metrics_url
    "#{@graphite_url}/metrics/index.json"
  end
  
  private

  def format(timestamp)
    time = Time.at(timestamp)
    time.strftime("%H:%M_%Y%m%d")
  end

  def target_params(targets)
    Array(targets).map { |t| "target=#{t}" }.join('&')
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