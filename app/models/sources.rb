module Sources
  extend self

  class UnknownPluginError < StandardError; end

  TYPES = %w(boolean datapoints number ci)

  TYPES.each do |type|
    define_method("#{type}_plugin") do |name|
      plugin_clazz(type, name).new
    end
  end

  def sources
    result = {}
    TYPES.each do |type|
      type_result = {}
      source_names(type).each do |name|
        type_result[name] = source_properties(type, name)
      end
      result[type] = type_result
    end
    result
  end

  protected

  def source_properties(type, name)
    plugin = plugin_clazz(type, name).new
    {
      "name"                     => name,
      "available"                => plugin.available?,
      "supports_target_browsing" => plugin.supports_target_browsing?,
      "fields"                   => plugin.fields
    }
  end

  def source_names(type)
    path = Rails.root.join("app/models/sources/#{type}")
    Dir["#{path}/*"].map { |f| File.basename(f, '.*') }.reject! { |name| name == "base" }
  end

  def plugin_clazz(type, name)
    raise ArgumentError, "source name param missing" if name.blank?
    "Sources::#{type.camelize}::#{name.camelize}".constantize
  rescue NameError => e
    raise UnknownPluginError, "Unknown Plugin: #{type} - #{name}: #{e}"
  end

end