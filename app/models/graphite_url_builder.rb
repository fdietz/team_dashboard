class GraphiteUrlBuilder

  def initialize(base_url)
    @base_url = base_url
  end

  def datapoints_url(targets, from, to)
    params = { :target => Array(targets), :format => "json", :from => format(from), :until => format(to) }
    { :url => "#{@base_url}/render", :params => params }
  end

  def metrics_url
    "#{@base_url}/metrics/index.json"
  end

  def format(timestamp)
    time = Time.at(timestamp).utc
    time.strftime("%H:%M_%Y%m%d")
  end

end
