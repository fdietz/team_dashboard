module Sources
  module Number
    class JiraFilterCount < Sources::Number::Base

      def available?
        Rails.configuration.jira_url.present?
      end

      def count_by_filter_id(filter_id)
        uri = URI(Rails.configuration.jira_url)
        params = { :maxResults => "1000", :jql => "filter = #{filter_id}"}
        uri.query = URI.encode_www_form(params)

        req = Net::HTTP::Get.new(uri.request_uri)
        req.basic_auth Rails.configuration.jira_user, Rails.configuration.jira_password

        res = Net::HTTP.start(uri.hostname, uri.port) {|http|
          http.request(req)
        }
        JSON.parse(res.body)["total"]
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
