module Sources
  module Boolean

    class Pingdom < Sources::Boolean::Base

      def fields
        [
          { :name => "user", :title => "User name", :mandatory => true },
          { :name => "password", :title => "Password", :mandatory => true },
          { :name => "key", :title => "Key", :mandatory => true},
          { :name => "check", :title => "Check Name", :mandatory => true}
        ]
      end

      def get(options = {})
        widget = Widget.find(options.fetch(:widget_id))
        settings = widget.settings
        connection = SimplePingdomInterface.new(settings.fetch(:user), settings.fetch(:password), settings.fetch(:key), settings.fetch(:check))
        { :value => connection.status }
      end

    end

  end
end
