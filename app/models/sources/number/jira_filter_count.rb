# Configuration:
#  Add Jira URL, User and Passwort to config/application.js or set JIRA_URL,
#  JIRA_USER and JIRA_PASSWORD for your environment.
#
# Usage:
#  Create a Search Filter in your Jira installation and remember the
#  Filter ID (requestId in URL when viewing the filter). Paste this ID to
#  the number widget. That's it.
#
# Author:
#  tubit (Thanks to thilko)

module Sources
  module Number
    class JiraFilterCount < Sources::Number::Base

      def available?
        Rails.configuration.jira_url.present?
      end

      def count_by_filter_id(filter_id)
        jira_uri          = URI.parse(Rails.configuration.jira_url)
        jira_uri.user     = Rails.configuration.jira_user if Rails.configuration.jira_user
        jira_uri.password = Rails.configuration.jira_password if Rails.configuration.jira_password
        jira_uri.query    = URI.encode_www_form(:maxResults => "1000", :jql => "filter = #{filter_id}")

        Rails.logger.debug("Requesting from #{jira_uri.to_s} ...")
        res = ::HttpService.request(jira_uri.to_s)
        res["total"]
      end

      def fields
        [
          { :name => "filter_id", :title => "Jira Filter ID", :mandatory => true }
        ]
      end

      def get(options={})
        widget    = Widget.find(options.fetch(:widget_id))
        filter_id = widget.settings.fetch(:filter_id)

        { :value => count_by_filter_id(filter_id) }
      end
    end
  end
end
