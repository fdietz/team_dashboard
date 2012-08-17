class GangliaUrlBuilder

  def initialize(base_url)
    @base_url = base_url
  end

  def datapoints_url(target, from, to)
    cluster, host, metric = parse_target(target)
    url = "#{@base_url}/graph.php"
    params = { :c => cluster, :h => host, :m => metric, :json => 1 }
    { :url => url, :params => params.merge(custom_range_params(from, to)) }
  end

  def metrics_url(query)
    "#{@base_url}/search.php?q=#{query}"
  end

  def parse_target(target)
    target =~ /(.*)@(.*)\((.*)\)/
    host    = $1
    cluster = $2
    metric  = $3
    [cluster, host, metric]
  end

  def custom_range_params(from, to)
    { :r => "custom", :cs => format(from), :ce => format(to) }
  end

  def format(timestamp)
    time = Time.at(timestamp).utc
    time.strftime("%m/%d/%Y %H:%M")
  end

end