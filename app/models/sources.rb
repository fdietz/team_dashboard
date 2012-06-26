module Sources
  extend self

  class UnknownPluginError < StandardError; end

  TYPES = %w(boolean datapoints number targets)

  # require all source plugins
  def eager_require
    TYPES.each do |name|
      path = Rails.root.join("app/models/sources/#{name}")
      Dir["#{path}/*"].each { |f| require f }
    end
  end

  # def boolean_source_names
  #   sources("boolean")
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

  def source_names(type)
    "Sources::#{type.camelize}::Base".constantize.descendants.map { |clazz| clazz_name(clazz) }
  end

  def plugin_clazz(type, name)
    "Sources::#{type.camelize}::#{name.camelize}".constantize
  rescue NameError => e
    raise UnknownPluginError, "Unknown Plugin: #{type} - #{name}"
  end

  def clazz_name(clazz)
    clazz.to_s.split("::").last.downcase
  end
end