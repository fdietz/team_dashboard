require 'open-uri'

module Sources
  module Ci
    class Teamcity < Sources::Ci::Base

      def custom_fields
        [
          { :name => "server_url", :title => "Server Url", :mandatory => true },
          { :name => "project", :title => "Project", :mandatory => true },
        ]
      end

      # Returns ruby hash:
      def get(options = {})
        widget = Widget.find(options.fetch(:widget_id))
        project = widget.settings.fetch(:project)
        server_url = widget.settings.fetch(:server_url)

        xml_response = request_build_status(server_url, project)

        {
          :last_build_time   => nil, # currently unused by widget
          :last_build_status => aggregated_build_status_from(xml_response),
          :current_status    => -1
        }
      end

      def request_build_status(server_url, project)
        url = "#{server_url}/guestAuth/app/rest/builds?locator=project:id:#{project}"
        Rails.logger.debug("Requesting from #{url} ...")
        ::HttpService.request(url)
      end

      def aggregated_build_status_from(xml_response)
        result = xml_response
        builds = result.fetch("builds").fetch("build")
        builds.sort_by! { |elem| [elem['buildTypeId'], elem['number'].to_i * -1 ] }
        latestBuilds = builds.uniq { |e| e['buildTypeId']}
        (latestBuilds.count { |e| e['status']=="SUCCESS" } == latestBuilds.count) ? 0 : 1
      end

    end
  end
end