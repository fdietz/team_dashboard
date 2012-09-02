require 'open-uri'

module Sources
  module Ci
    class Travis < Sources::Ci::Base

      def fields
        [
          { :name => "server_url", :title => "Server Url", :mandatory => true },
          { :name => "project", :title => "Project", :mandatory => true },
        ]
      end

      # Returns ruby hash:
      def get(server_url, project, options = {})
        result = request_build_status(server_url, project)
        {
          :label             => result["slug"],
          :last_build_time   => result["last_build_finished_at"],
          :last_build_status => status(result["last_build_status"]),
          :current_status    => current_status(result["last_build_finished_at"])
        }
      end

      def request_build_status(server_url, project)
        url = "#{server_url}/#{project}.json"
        Rails.logger.debug("Requesting from #{url} ...")
        ::HttpService.request(url)
      end

      def status(status)
        status || -1
      end

      def current_status(status)
        return 1 if status.blank?
        DateTime.parse(status)
        0
      rescue ArgumentError
        -1
      end

    end
  end
end