# Gives you the "basic" new relic stats as numbers. All mushed into one file so that it
# makes a standalone plugin for the dashboard
#
# Valid Names are
#
# * Apdex
# * Response Time
# * Throughput
# * Memory
# * CPU
# * DB
#
module Sources
  module Number
    class NewRelic < Sources::Number::Base

      def custom_fields
        [
          { :name => "value_name", :title => "Value Name", :mandatory => true },
          { :name => "app_name", :title => "Application Name", :mandatory => false },
        ]
      end

      def get(options = {})
        widget     = Widget.find(options.fetch(:widget_id))
        value_name = widget.settings.fetch(:value_name)
        app_name   = widget.settings.fetch(:app_name)

        { :value => connection_instance(app_name).threshold_value(value_name).metric_value }
      end

      private

      def connection_instance(app_name)
        NewRelicConnection.instance(
          BackendSettings.secrets.new_relic_api_key,
          app_name
        )
      end

    end
  end
end
