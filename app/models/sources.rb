module Sources
  extend self

  def handler(source)
    raise ArgumentError, "Unknown source #{source}" unless Rails.configuration.available_sources.include?(source)

    case(source)
    when 'demo'
      Sources::Demo.new
    when 'graphite'
      Sources::Graphite.new(:graphite_url => Rails.configuration.graphite_url)
    end
  end

end