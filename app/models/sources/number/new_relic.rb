module Sources
  module Number
    class NewRelic < Sources::Number::Base

      def get(options = {})
        api_key, value_name = options.fetch(:http_proxy_url).split(':')
        { :value => NewRelicConnection.instance(api_key).threshold_value(value_name).metric_value }
      end

    end
  end
end