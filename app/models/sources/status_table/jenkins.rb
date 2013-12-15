module Sources
  module StatusTable
    class Pingdom < Sources::StatusTable::Base

      def custom_fields
        [
          { :name => "server_url", :title => "Server Url", :mandatory => true }
        ]
      end

      def jenkins(server_url)
        JenkinsInterface.new(server_url)
      end

      def available?
        true
      end

      def get(options = {})
        widget     = Widget.find(options.fetch(:widget_id))
        server_url = widget.settings.fetch(:server_url)
        jenkins(server_url).status_table
      end

    end
  end
end
