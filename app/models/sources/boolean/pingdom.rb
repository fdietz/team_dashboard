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
        connection = SimplePingdomInterface.new(settings.fetch(:check))
        { :value => connection.status }
      end

    end

  end
end
