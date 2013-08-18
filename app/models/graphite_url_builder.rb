class GraphiteUrlBuilder

  def initialize(base_url)
    @base_url = base_url
  end

  def datapoints_url(targets, from, to)
    params = { :target => Array(targets), :format => "json", :from => format(from), :until => format(to) }
    { :url => "#{@base_url}/render", :params => params }
  end

  def datapoints_svg_url(targets, from, to, options = {})
    query = []
    query << Array(targets).reject(&:blank?).map { |t| "target=#{CGI.escape(t)}" }
    query << "from=#{CGI.escape(format(from))}"
    query << "until=#{CGI.escape(format(to))}"

    svg_params = ["format=svg", "hideGrid=true", "hideLegend=true", "width=#{options[:width]}", "height=#{options[:height]}"]
    query += svg_params

    "#{@base_url}/render?#{query.join('&')}"
  end

  def metrics_url
    "#{@base_url}/metrics/index.json"
  end

  def format(timestamp)
    time = Time.at(timestamp)
    time.strftime("%H:%M_%Y%m%d")
  end

end
