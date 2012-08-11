module Sources
  module Number
    class HttpProxy < Sources::Number::Base
      def get(options = {})
        ::HttpService.request(options.fetch(:http_proxy_url))
      end
    end
  end
end