module Sources
  module Boolean

    class Pingdom < Sources::Boolean::Base

      def available?
        BackendSettings.pingdom.enabled?
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
