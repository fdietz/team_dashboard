module Sources
  extend self

  class UnknownPluginError < StandardError; end

  TYPES = %w(boolean datapoints number targets ci)

  # def boolean_source_names
  #   source_names("boolean")
  # end
  TYPES.each do |type|
    define_method("#{type}_source_names") do
      source_names(type)
    end
  end

  # def boolean_plugin(name)
  #   plugin_clazz(type, name)
  # end
  TYPES.each do |type|
    define_method("#{type}_plugin") do |name|
      plugin_clazz(type, name).new
    end
  end

  protected

  # FIXME: cleanup all this base/graphite hackety
  def source_names(type)
    path = Rails.root.join("app/models/sources/#{type}")
    Dir["#{path}/*"].map { |f| File.basename(f, '.*') }.reject! { |name| name == "base" || (name == "graphite" && graphite_unavailable?) }
  end

  def plugin_clazz(type, name)
    raise ArgumentError, "source name param missing" if name.blank?
    "Sources::#{type.camelize}::#{name.camelize}".constantize
  rescue NameError => e
    raise UnknownPluginError, "Unknown Plugin: #{type} - #{name}: #{e}"
  end

  def clazz_name(clazz)
    clazz.to_s.demodulize.underscore
  end

  def graphite_unavailable?
    Rails.configuration.graphite_url.blank?
  end
end