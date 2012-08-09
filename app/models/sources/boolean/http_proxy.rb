module Sources
  module Boolean
    class HttpProxy < Sources::Boolean::Base
      def get(options = {})
        ::HttpProxy.request(options.fetch(:http_proxy_url))
      end
    end
  end
end