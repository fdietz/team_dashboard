module Sources
  extend self

  def handler(source)
    case(source)
    when 'graphite'
      Sources::Graphite.new(:graphite_url => Rails.configuration.graphite_url)
    else
      raise ArgumentError, "Unknown source #{source}"
    end
  end

end