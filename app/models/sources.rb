module Sources
  extend self

  class UnknownPluginError < StandardError; end

  def available_source_types
    @available_source_types ||= begin
      path = Rails.root.join("app/models/sources")
      Dir["#{path}/*"].map { |directory| Pathname.new(directory).basename }.map(&:to_s)
    end
  end

  available_source_types.each do |type|
    define_method("#{type}_plugin") do |name|
      plugin_clazz(type, name).new
    end
  end

  def widget_type_to_source_type(type)
    case type
    when "graph" then "datapoints"
    when "meter" then "number"
    else
      type
    end
  end

  def sources
    result = {}
    available_source_types.each do |type|
      type_result = {}
      source_names(type).each do |name|
        type_result[name] = source_properties(type, name)
      end
      result[type] = type_result
    end
    result
  end

  def [](type)
    sources[type] || []
  end

  def plugin_clazz(type, name)
    raise ArgumentError, "source name param missing" if name.blank?
    "Sources::#{type.camelize}::#{name.camelize}".constantize
  rescue NameError => e
    raise UnknownPluginError, "Unknown Plugin: #{type} - #{name}: #{e}"
  end

  def source_names(type)
    path = Rails.root.join("app/models/sources/#{type}")
    Dir["#{path}/*"].map { |f| File.basename(f, '.*') }.reject! { |name| name == "base" }
  end

  protected

  def source_properties(type, name)
    plugin = plugin_clazz(type, name).new
    {
      name:                     name,
      available:                plugin.available?,
      supports_target_browsing: plugin.supports_target_browsing?,
      supports_functions:       plugin.supports_functions?,
      custom_fields:            plugin.custom_fields,
      default_fields:           plugin.default_fields
    }
  end

end