module Sources
  extend self

  def handler(source)
    case(source)
    when 'simple_metrics'
      Sources::SimpleMetrics.new
    when 'graphite'
      Sources::Graphite.new(:graphite_url => ENV['GRAPHITE_URL'])
    else
      raise ArgumentError, "Unknown source #{source}"
    end
  end

end