require 'open-uri'

module Sources
  module Ci
    class Travis

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
        request_url = "#{server_url}/#{project}.json"
        uri = URI.parse(request_url)
        Rails.logger.debug("Requesting from #{uri} ...")
        JSON.parse(uri.read)
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