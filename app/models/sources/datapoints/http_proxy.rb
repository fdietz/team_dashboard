module Sources
  module Datapoints
    class HttpProxy < Sources::Datapoints::Base
      def get(targets, from, to, options = {})
        ::HttpProxy.request(options.fetch(:http_proxy_url))
      end
    end
  end
end