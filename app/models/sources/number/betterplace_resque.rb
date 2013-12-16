require 'open-uri'

module Sources
  module Number

    # Gives you the score for a user in the Jenkins CI game.
    # See https://wiki.jenkins-ci.org/display/JENKINS/The+Continuous+Integration+Game+plugin
    # for the Jenkins plugin
    #
    # The following parameters must be provided:
    # * url - URL of the game's leaderboard
    # * user_name - user name for the user whose score you want to show
    class BetterplaceResque < Sources::Number::Base

      def available?
        true
      end

      def supports_target_browsing?
        false
      end

      def supports_functions?
        false
      end

      def custom_fields
        [
          { :name => "url", :title => "Status URL", :mandatory => true },
          { :name => "queue", :title => "Queue Name", :mandatory => true }
        ]
      end

      def get(options = {})
        widget     = Widget.find(options.fetch(:widget_id))
        url = widget.settings.fetch(:url)
        queue = widget.settings.fetch(:queue)

        result = ::HttpService.request(url)

        { :value => result['resque'][queue] }
      end

    end
  end
end

