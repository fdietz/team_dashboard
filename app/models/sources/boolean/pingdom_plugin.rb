=begin
    Pingdom Datasource Plug-in
    Version: 1.0
    Date: 22.10.2012
    Implemented by Dragan Mileski
    e-mail: dragan.mileski@gmail.com
=end


module Sources
    module Boolean
        class PingdomPlugin < Sources::Boolean::Base

            def available?
                Rails.configuration.pingdom_username.present? && Rails.configuration.pingdom_password.present?
            end

            def fields
                [
                    { :name => "check_name", :title => "Check name", :mandatory => true}
                ]
            end

            def get(options = {})
                pingdom_username = Rails.configuration.pingdom_username
                pingdom_password = Rails.configuration.pingdom_password
                check_name = options.fetch(:fields)[:check_name]

                check_state = false #It will show false unless the conditions below are fulfilled and the blocks set "check_state" variable to TRUE

                url = "https://#{CGI.escape(pingdom_username)}:#{pingdom_password}@api.pingdom.com/api/2.0/checks"

                response = ::HttpService.request(url, :headers => { 'App-Key' => '9ucbwe7se1uf61l59h2s0zm6ogjzpd7v'} )
                    
                response["checks"].each do |item|
                    if (item["name"].eql? check_name) && (item["status"].eql? "down")
                        puts "The check_name exists and the page is Down!"
                    elsif (item["name"].eql? check_name) && (item["status"].eql? "up")
                        puts "The check_name exists and the page is UP!"
                        check_state = true
                    else
                        puts ""
                        puts '********************** ERROR **********************'
                        puts "THE CHECK_NAME YOU ENTERED IS PROBABLY INCORRECT!!!"
                        reise Sources::Booleans::NotFoundError
                    end
                end

                result = { :value => check_state }
            end
        end
    end
end
