module Sources
  module Boolean
    class HttpProxy < Sources::Boolean::Base

      def fields
        [
          { :name => "http_proxy_url", :title => "Proxy Url", :mandatory => true },
          { :name => "value_path", :title => "Value Path" },
        ]
      end

      def get(options = {})
        ::HttpService.request(options.fetch(:http_proxy_url))
      end

    end
  end
end