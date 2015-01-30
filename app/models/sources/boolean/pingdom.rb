module Sources
  module Boolean

    class Pingdom < Sources::Boolean::Base

      def available?
        BackendSettings.secrets.pingdom_user.present? && BackendSettings.secrets.pingdom_password.present? && BackendSettings.secrets.pingdom_api_key.present?
      end

      def custom_fields
        [
          { :name => "check", :title => "Check Name", :mandatory => true}
        ]
      end

      def get(options = {})
        widget = Widget.find(options.fetch(:widget_id))
        settings = widget.settings
        connection = SimplePingdomInterface.new.make_request
        { :value => connection.status_ok?(settings.fetch(:check)) }
      end

    end

  end
end
