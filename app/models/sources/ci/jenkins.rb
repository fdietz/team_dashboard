require 'open-uri'

module Sources
  module Ci
    class Jenkins < Sources::Ci::Base

      def fields
        [
          { :name => "server_url", :title => "Server Url", :mandatory => true },
          { :name => "project", :title => "Project", :mandatory => true },
        ]
      end

      # Returns ruby hash:
      def get(options = {})
        widget     = Widget.find(options.fetch(:widget_id))
        project    = widget.settings.fetch(:project)
        server_url = widget.settings.fetch(:server_url)
        result     = request_build_status(server_url)
        result     = XML::Parser.string(result).parse rescue result

        result["Projects"]["Project"].each do |data|
          if data['name'] == project
            return {
              :label             => data["name"],
              :last_build_time   => Time.parse(data["lastBuildTime"]),
              :last_build_status => status(data["lastBuildStatus"]),
              :current_status    => current_status(data["activity"])
            }
          end
        end
      end

      def request_build_status(server_url)
        url = "#{server_url}/cc.xml"
        Rails.logger.debug("Requesting from #{url} ...")
        ::HttpService.request(url)
      end

      def status(status)
        case status
        when /success/i
          0
        when /failure/i
          1
        else
          -1
        end
      end

      def current_status(status)
        case status
        when /sleeping/i
          0
        when /building/i
          1
        else
          -1
        end
      end

    end
  end
end
