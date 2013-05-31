# Pingdom Datasource Plug-in
# Version: 1.0
# Date: 22.10.2012
# Implemented by Dragan Mileski
# e-mail: dragan.mileski@gmail.com

# Find the configuration variables in your application.rb:
#
#   config.pingdom_username = ENV['PINGDOM_USERNAME']
#   config.pingdom_password = ENV['PINGDOM_PASSWORD']
#
module Sources
  module Boolean
    class Pingdom < Sources::Boolean::Base
      class NotFoundError < StandardError; end

      def available?
        Rails.configuration.pingdom_username.present? && Rails.configuration.pingdom_password.present?
      end

      def fields
        [
          { :name => "check_name", :title => "Check name", :mandatory => true }
        ]
      end

      def get(options = {})
        pingdom_username = Rails.configuration.pingdom_username
        pingdom_password = Rails.configuration.pingdom_password
        widget           = Widget.find(options.fetch(:widget_id))
        check_name       = widget.settings.fetch(:check_name)

        url = "https://#{CGI.escape(pingdom_username)}:#{pingdom_password}@api.pingdom.com/api/2.0/checks"

        response = ::HttpService.request(url, :headers => { 'App-Key' => '9ucbwe7se1uf61l59h2s0zm6ogjzpd7v'} )

        response["checks"].each do |item|
          if item["name"] == check_name
            if item["status"] == 'up'
              return { :value => true }
            else
              Rails.logger.warn("Pingdom: '#{check_name}' check is down!")
              return { :value => false }
            end
          end
        end

        Rails.logger.fatal("Could not find a Pingdom check with the name '#{check_name}'!")
        raise NotFoundError
      end
    end
  end
end
