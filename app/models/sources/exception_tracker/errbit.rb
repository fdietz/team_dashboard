require 'open-uri'

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
        fields = options.fetch(:fields)
        result = request_stats(fields.fetch(:server_url), fields.fetch(:api_key))

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