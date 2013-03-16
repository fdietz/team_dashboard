# See http://support.hockeyapp.net/kb/api/api-crash-log-description-and-stack-trace for more details
#
# Note, that you have to provide an API token and an app identifier.
#
# Create an api_token here: https://rink.hockeyapp.net/manage/auth_tokens
#
# Authors: Marno Krahmer, Frederik Dietz(@fdietz)
#
module Sources
  module Number
    class HockeyApp < Sources::Number::Base

      def fields
        [
          { :name => "app_identifier", :title => "App Identifier", :mandatory => true },
          { :name => "app_token", :title => "App Token", :mandatory => true }
        ]
      end

      def get(options = {})
        widget         = Widget.find(options.fetch(:widget_id))
        app_identifier = widget.settings.fetch(:app_identifier)
        api_token      = widget.settings.fetch(:api_token)

        url = "https://rink.hockeyapp.net/api/2/apps/#{app_identifier}/crashes?symbolicated=1&page=1"
        Rails.logger.debug("Requesting from #{url} ...")
        response = HttpService.request(url, :headers => { "X-HockeyAppToken" => @api_token })
        { :value => response["total_entries"] }
      end
    end
  end
end
