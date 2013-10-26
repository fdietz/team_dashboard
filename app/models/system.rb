class System

  def as_json(options = {})
    result = super

    result[:sources] = Sources.sources
    result[:widgets] = Widget.list_available

    result
  end
end