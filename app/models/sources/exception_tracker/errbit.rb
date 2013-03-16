require 'open-uri'

# You must provide the server URL and API Key for your registered application.
#
# Example for Errbit: 3139359fa87f81665add733ba173bbd4
#
module Sources
  module ExceptionTracker
    class Errbit < Sources::ExceptionTracker::Base

      def fields
        [
          { :name => "server_url", :title => "Errbit Server Url", :mandatory => true },
          { :name => "api_key", :title => "API Key", :mandatory => true }
        ]
      end

      # Returns ruby hash:
      def get(options = {})
        widget     = Widget.find(options.fetch(:widget_id))
        server_url = widget.settings.fetch(:server_url);
        api_key    = widget.settings.fetch(:api_key);

        result     = request_stats(server_url, api_key)
        {
          :label             => result["name"],
          :last_error_time   => result["last_error_time"],
          :unresolved_errors => result["unresolved_errors"]
        }
      end

      def request_stats(server_url, api_key)
        url = "#{server_url}/api/v1/stats/app.json?api_key=#{api_key}"
        Rails.logger.debug("Requesting from #{url} ...")
        ::HttpService.request(url)
      end
    end
  end
end