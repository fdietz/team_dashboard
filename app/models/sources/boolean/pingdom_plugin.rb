module Sources
    module Boolean
        class PingdomPlugin < Sources::Boolean::Base

            @@state = false

            def fields
                [
                    { :name => "pingdom_username", :title => "Pingdom username", :mandatory => true },
                    { :name => "pingdom_password", :title => "Pingdom password", :mandatory => true },                   
                    { :name => "check_name", :title => "Check name", :mandatory => true}
                ]
            end

            def get(options = {})
                pingdom_username = options.fetch(:fields)[:pingdom_username]
                pingdom_password = options.fetch(:fields)[:pingdom_password]
                check_name = options.fetch(:fields)[:check_name]
                if pingdom_username.present? && pingdom_password.present?

                    puts "********************************** PINGDOM PART **********************************"
                    
                    auth = {:username => pingdom_username, :password => pingdom_password }
                    response = Pingdom.get("https://api.pingdom.com/api/2.0/checks", :basic_auth => auth)

                    response["checks"].each do |item|
                        if (item["name"].eql? check_name) && (item["status"].eql? "up")
                            puts "YEAHHHH BABY"
                            @@state = true
                        end
                    end
                end
                result = { :value => @@state }
            end
        end
    end
end
