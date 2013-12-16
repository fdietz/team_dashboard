require 'open-uri'

module Sources
  module Ci
    class Jenkins < Sources::Ci::Base

      def custom_fields
        [
          { :name => "server_url", :title => "Server Url", :mandatory => true },
          { :name => "project", :title => "Project", :mandatory => true },
        ]
      end

      def jenkins(server_url)
        JenkinsInterface.new(server_url)
      end

      # Returns ruby hash:
      def get(options = {})
        widget     = Widget.find(options.fetch(:widget_id))
        project    = widget.settings.fetch(:project)
        server_url = widget.settings.fetch(:server_url)
        jenkins(server_url).single_result(project)
      end

    end
  end
end
