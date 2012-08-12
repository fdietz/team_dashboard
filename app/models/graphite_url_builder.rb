class GraphiteUrlBuilder

  def initialize(base_url)
    @base_url = base_url
  end

  def datapoints_url(targets, from, to)
    "#{@base_url}/render?#{target_params(targets)}&format=json&from=#{CGI.escape(format(from))}&until=#{CGI.escape(format(to))}"
  end

  def metrics_url
    "#{@base_url}/metrics/index.json"
  end

  def format(timestamp)
    time = Time.at(timestamp)
    time.strftime("%H:%M_%Y%m%d")
  end

  def target_params(targets)
    Array(targets).map { |t| "target=#{t}" }.join('&')
  end

end
