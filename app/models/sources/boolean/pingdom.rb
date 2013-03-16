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

        check_state = false #It will show false unless the conditions below are fulfilled and the blocks set "check_state" variable to TRUE

        url = "https://#{CGI.escape(pingdom_username)}:#{pingdom_password}@api.pingdom.com/api/2.0/checks"

        response = ::HttpService.request(url, :headers => { 'App-Key' => '9ucbwe7se1uf61l59h2s0zm6ogjzpd7v'} )

        response["checks"].each do |item|
          if item["name"].eql? check_name
            case item["status"]
            when "up"
              check_state = true
            else
              Rails.logger.debug("\n********************** WARNING **********************")
              Rails.logger.debug("SOMETHING IS WRONG WITH YOUR PINGDOM CHECK. PLEASE CHECK YOUR PINGDOM ACCOUNT!!!\n")
              raise Sources::Booleans::NotFoundError
            end
          else
            Rails.logger.debug("\n********************** ERROR **********************")
            Rails.logger.debug("THE CHECK_NAME YOU ENTERED IS PROBABLY INCORRECT!!!\n")
            raise Sources::Booleans::NotFoundError
          end
        end
        { :value => check_state }
      end

    end
  end
end
