module Sources
  module StatusTable
    class Jenkins < Sources::StatusTable::Base

      def custom_fields
        [
          { name: "server_url", title: "Server Url", mandatory: true },
          { name: "projects", title: "Projects (regexp)", mandatory: false }
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
        projects = widget.settings[:projects]
        status_table = filter_status(projects, jenkins(server_url).status_table)

        build_json_response(status_table)
      end

      def filter_status(projects, status_table)
        return status_table if projects.blank?
        status_table.reject { |stat| !(stat['label'] =~ /#{projects}/) }
      end

    end
  end
end
