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
      if is_array_element?(path)
        #In array name puts the name of the array element
        array_name = path.split('[')
        array_name = array_name[0]

        #Makes sure that the number between brackets will be taken as array element number
        numbers_contained_in_array_name = path.scan(/\d+/)
        array_element = numbers_contained_in_array_name.pop

        #Updates 2 times in order to pass through the array and the specific element itself
        current_element = current_element[array_name]
        current_element = current_element[array_element.to_i]
      else

        #Proceeds the normal way if the element is not a path
        current_element = current_element[path]
      end
    end
    current_element
  end

  def is_array_element?(path)
    path.count('[') == 1 && path.count(']') == 1
  end

end