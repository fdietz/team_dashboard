module HttpProxyResolver

  def custom_fields
    [
      { :name => "proxy_url", :title => "Proxy Url", :mandatory => true },
      { :name => "proxy_value_path", :title => "Value Path" }
    ]
  end

  def get(options = {})
    widget        = Widget.find(options.fetch(:widget_id))
    value_path    = widget.settings.fetch(:proxy_value_path);
    response_body = ::HttpService.request(widget.settings.fetch(:proxy_url), :headers => { :accept =>  'application/json' })

    Rails.logger.debug "HttpProxyResolver - Response Body: #{response_body}"
    if value_path.present?
      Rails.logger.debug "HttpProxyResolver - value_path: #{value_path} - resolved value: #{resolve_value(response_body, value_path)}"
    end

    if value_path.present?
      { :value => resolve_value(response_body, value_path) }
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