module Sources
  module Number
    class PingdomResponse < Sources::Number::Base

      def available?
        true
      end

      def supports_target_browsing?
        false
      end

      def supports_functions?
        false
      end


      def get(options = {})
        widget = Widget.find(options.fetch(:widget_id))
        settings = widget.settings
        connection = SimplePingdomInterface.new(settings.fetch(:user), settings.fetch(:password), settings.fetch(:key), settings.fetch(:check))
        { :value => connection.response_time }
      end

    end
  end
end
