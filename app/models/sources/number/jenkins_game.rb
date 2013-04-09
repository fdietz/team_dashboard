require 'open-uri'

module Sources
  module Number

    # Gives you the score for a user in the Jenkins CI game. All mushed into one file so that it
    # makes a standalone plugin for the dashboard.
    #
    # The following parameters must be provided:
    # * url - URL of the game's leaderboard
    # * user_name - user name for the user whose score you want to show
    class JenkinsGame < Sources::Number::Base

      def available?
        true
      end

      def supports_target_browsing?
        false
      end

      def supports_functions?
        false
      end

      def fields
        [
          { :name => "url", :title => "URL", :mandatory => true },
          { :name => "user_name", :title => "User name", :mandatory => true }
        ]
      end

      def get(options = {})
        url = options.fetch(:fields).fetch(:url)
        user_name = options.fetch(:fields).fetch(:user_name)

        doc = Nokogiri::HTML(open(url))
        value = doc.at_css("td a[href='/user/#{user_name}']").parent.parent.children.last.text.to_i
        { :value => value }
      end

    end
  end
end
