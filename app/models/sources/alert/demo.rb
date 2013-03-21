module Sources
    module Alert
        class Demo < Sources::Alert::Base

            WARNING_MESSAGES = ["Disk is 50% full!",
                "Responce time is 30% lower than yesterday",
                "Usage ratio increased by 50%",
                "CPU workload 48%",
                "Database responce time is above the maximal"]

            ERROR_MESSAGES = ["Process XXX is not responding!",
                "Can't write to the disk!",
                "Web page is down!",
                "Jenkins build failed!",
                "Data writing aborted!"]

            def available?
                true 
            end

            def get(options = {})

                rand_value = rand(0..3)
                which_message = rand(0..4)
                
                label = case rand_value
                when 0
                    "System status OK"
                when 1
                    WARNING_MESSAGES[which_message]
                when 2
                    ERROR_MESSAGES[which_message]
                else
                    "Unknown System Status!"
                end

                Rails.logger.debug("The value is #{rand_value} and the label is #{label}")

                {:value => rand_value ,:label =>"DemoClient: RandomClient<br/>DemoCheck: RandomCheck<br/>DemoMessage: #{label}<br/><br/>"*5 }
            end

        end
    end
end