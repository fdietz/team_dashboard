class GangliaUrlBuilder

  def initialize(base_url)
    @base_url = base_url
  end

  def datapoints_url(target, from, to)
    cluster, host, metric = parse_target(target)
    result = "#{@base_url}/graph.php?c=#{cluster}&h=#{host}&m=#{metric}&json=1"
    # TODO: use custom range when Ganglia issue is fixed: https://github.com/ganglia/ganglia-web/issues/121
    # result << "&#{custom_range_params(from, to)}"
    result << "&#{approximate_range_params(from, to)}"
  end

  def metrics_url(query)
    "#{@base_url}/search.php?q=#{query}"
  end
  
  def parse_target(target)
    target =~ /(.*)@(.*) \((.*)\)/
    host    = $1
    cluster = $2
    metric  = $3
    [cluster, host, metric]
  end

  # TODO: replace with custom_range_params
  def approximate_range_params(from, to)
    diff  = (to - from) / 60
    hour  = 60
    day   = hour * 24
    week  = day * 7
    month = week * 4

    range = if diff/month > 0
      "month"
    elsif diff/week > 0
      "week"
    elsif diff/day > 0
      "day"
    elsif diff/(3*hour) > 0
      "4hr"
    elsif diff/(2*hour) > 0
      "2hr"
    else
      "hour"
    end
    "r=#{range}"
  end

  def custom_range_params(from, to)
    "&r=custom&cs=#{CGI.escape(format(from))}&ce=#{CGI.escape(format(to))}"
  end

  def format(timestamp)
    time = Time.at(timestamp)
    time.strftime("%m/%d/%Y %H:%M")
  end

end