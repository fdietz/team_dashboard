#
# Use the "Value Path" setting to select nested value from JSON structure:
#   {
#     "parent" : {
#       "child" : {
#         "child2" : "myValue"
#       }
#     }
#   }
#
# Example: parent.child.nestedChild.value
module Sources
  module Boolean
    class HttpProxy < Sources::Boolean::Base

      def fields
        [
          { :name => "proxy_url", :title => "Proxy Url", :mandatory => true },
          { :name => "proxy_value_path", :title => "Value Path" },
        ]
      end

      def get(options = {})
        widget        = Widget.find(options.fetch(:widget_id))
        response_body = ::HttpService.request(widget.settings.fetch(:proxy_url))
        value_path    = widget.settings.fetch(:proxy_value_path);

        if value_path.present?
          result = { :value => resolve_value(response_body, value_path) }
          result.merge!(:response_body => response_body) if options[:include_response_body].to_s == "true"
          result
        else
          response_body
        end
      end

      private

      def resolve_value(document, value_path)
        paths = value_path.split(".");
        current_element = document
        paths.each do |path|
          current_element = current_element[path]
        end
        current_element
      end

    end
  end
end