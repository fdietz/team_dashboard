module HttpProxyResolver

  def fields
    [
      { :name => "proxy_url", :title => "Proxy Url", :mandatory => true },
      { :name => "proxy_value_path", :title => "Value Path" }
    ]
  end

  def get(options = {})
    widget        = Widget.find(options.fetch(:widget_id))
    response_body = ::HttpService.request(widget.settings.fetch(:proxy_url), :headers => { :accept =>  'application/json' })
    value_path    = widget.settings.fetch(:proxy_value_path);

    if value_path.present?
      result = { :value => resolve_value(response_body, value_path) }
      result
    else
      response_body
    end
  end

  def resolve_value(document, value_path)
    paths = value_path.split(".");
    current_element = document
    paths.each do |path|
      current_element = current_element[path]
    end
    current_element
  end

end