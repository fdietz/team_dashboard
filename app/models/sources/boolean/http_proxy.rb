module Sources
  module Boolean
    class HttpProxy < Sources::Boolean::Base
      def get(options = {})
        Sources::HttpProxy.request(options.fetch(:http_proxy_url))
      end
    end
  end
end