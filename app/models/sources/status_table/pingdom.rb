module Sources
  module StatusTable
    class Pingdom < Sources::StatusTable::Base

      def available?
        true
      end

      def custom_fields
        [
          { :name => "user", :title => "User name", :mandatory => true },
          { :name => "password", :title => "Password", :mandatory => true },
          { :name => "key", :title => "Key", :mandatory => true}
        ]
      end

      def get(options = {})
        widget = Widget.find(options.fetch(:widget_id))
        settings = widget.settings

        connection = SimplePingdomInterface.new(settings.fetch(:user), settings.fetch(:password), settings.fetch(:key), '').make_request

        build_json_response(connection.status_table)
      end

    end
  end
end
