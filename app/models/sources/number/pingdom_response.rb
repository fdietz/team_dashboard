module Sources
  module Number
    class PingdomResponse < Sources::Number::Base

      def available?
        BackendSettings.secrets.pingdom_user.present? && BackendSettings.secrets.pingdom_password.present? && BackendSettings.secrets.pingdom_api_key.present?
      end

      def supports_target_browsing?
        false
      end

      def supports_functions?
        false
      end

      def custom_fields
        [
          { :name => "check", :title => "Check Name", :mandatory => true}
        ]
      end

      def get(options = {})
        widget = Widget.find(options.fetch(:widget_id))
        settings = widget.settings
        connection = SimplePingdomInterface.new(settings.fetch(:check))
        { :value => connection.response_time }
      end

    end
  end
end
