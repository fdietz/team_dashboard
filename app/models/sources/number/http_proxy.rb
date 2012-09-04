module Sources
  module Number
    class HttpProxy < Sources::Number::Base

      def fields
        [
          { :name => "http_proxy_url", :title => "Proxy Url", :mandatory => true },
          { :name => "value_path", :title => "Value Path" },
        ]
      end

      def get(options = {})
        response_body = ::HttpService.request(options.fetch(:fields).fetch(:http_proxy_url))
        value_path = options.fetch(:fields)[:value_path];
        if value_path.present?
          result = { :value => resolve_value(response_body, value_path) }
          result.merge!(:response_body => response_body) if options[:include_response_body].to_s == "true"
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