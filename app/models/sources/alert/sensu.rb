module Sources
  module Alert
    class Sensu < Sources::Alert::Base

      def available?
        Rails.configuration.sensu_events.present?
      end

      def fields
        [
          { :name => "sensu_clients", :title => "Filter by clients", :mandatory => false },
          { :name => "ignored_checks", :title => "Ignore checks", :mandatory => false }
        ]
      end

      def get(options = {})
        widget                = Widget.find(options.fetch(:widget_id))
        sensu_ignored_checks  = widget.settings.fetch(:ignored_checks)
        sensu_client_filter   = widget.settings.fetch(:sensu_clients)
        
        #defining some global variables that will be used to store filtered data
        sensu_filtered_events = Array.new
        ignored_check_filtered_events = Array.new
        message = "Unknown Subsystem Status!"
        value = 500

        sensu_events = Rails.configuration.sensu_events.to_s + "/events"
        sensu_events_response = ::HttpService.request(sensu_events)
        
        sensu_client_filter = sensu_client_filter.to_s
        sensu_ignored_checks = sensu_ignored_checks.to_s

        #If both fields have data
        if (!sensu_client_filter.blank? && !sensu_ignored_checks.blank?)

          #Here we will keep the clients for filtering, if any...
          clients_array = sensu_client_filter.split(',')
          #Here we will keep the ignored checks for filtering, if any...
          ignored_checks_array = sensu_ignored_checks.split(',').map {
            |clietnt_check|
            client_name, check = clietnt_check.split(":")
            {:client_name => client_name, :check => check }
          }
    
          #Here we do the filtering by client for every event
          sensu_events_response.each do |event|
            clients_array.each do |client|
              if (event["client"].eql?(client))
                sensu_filtered_events.insert(0, event)
                break
              end
            end
          end

          if (sensu_filtered_events.empty?)
            Rails.logger.debug("**********************Sensu data source WARNING **********************")
            Rails.logger.debug("The client filters that you entered doesnt exist in the sensu event list")
            Rails.logger.debug("Please check your spelling, or their existance in your sensu checks list")
            return
          else
            sensu_filtered_events.each do |event|
              ignored_checks_array.each do |ignored_check|
                if (event["client"].eql?(ignored_check[:client_name]) && event["check"].eql?(ignored_check[:check]))
                  Rails.logger.debug("Sensu: Check: #{ignored_check[:check]} from Client: #{ignored_check[:client_name]} ignorred\n")
                else
                  ignored_check_filtered_events.insert(0, event)
                end
              end
            end
            if (sensu_filtered_events.size == ignored_check_filtered_events.size)
              Rails.logger.debug("**********************Sensu data source WARNING **********************")
              Rails.logger.debug("Your check ignorance didnt give any result. Please check your spelling")
              Rails.logger.debug("The format should be: client_name1:check_name1,client_name2:check_name2,...")
            end
            sensu_filtered_events = ignored_check_filtered_events
          end


          #If only client_filter is filled
        elsif (!sensu_client_filter.eql?(""))
          #Here we will keep the clients for filtering if any
          clients_array = sensu_client_filter.split(',')

          #Here we do the filtering by client for every event
          sensu_events_response.each do |event|
            clients_array.each do |client|
              if (event["client"].eql?(client))
                sensu_filtered_events.insert(0, event)
                break
              end
            end
          end

          if (sensu_filtered_events.empty?)
            Rails.logger.debug("**********************Sensu data source WARNING **********************")
            Rails.logger.debug("The client filters that you entered doesnt exist in the sensu event list")
            Rails.logger.debug("Please check your spelling, or their existance in your sensu checks list")
            return
          end
                    
          #If only a boring checks are filtered
        elsif (!sensu_ignored_checks.eql?(""))

          #Here we will keep the ignored checks for filtering, if any...
          ignored_checks_array = sensu_ignored_checks.split(',').map {
            |clietnt_check|
            client_name, check = clietnt_check.split(":")
            {:client_name => client_name, :check => check }
          }
          if (sensu_events_response.empty?)
            Rails.logger.debug("**********************Sensu data source WARNING **********************")
            Rails.logger.debug("The list of sensu events is empty please check your sensu configuration!")
            return
          else
            sensu_events_response.each do |event|
              ignored_checks_array.each do |ignored_check|
                if (event["client"].eql?(ignored_check[:client_name]) && event["check"].eql?(ignored_check[:check]))
                  Rails.logger.debug("Sensu: Check: #{ignored_check[:check]} from Client: #{ignored_check[:client_name]} ignorred\n")
                else
                  ignored_check_filtered_events.insert(0, event)
                end
              end
            end
            if (sensu_events_response.size == ignored_check_filtered_events.size)
              Rails.logger.debug("**********************Sensu data source WARNING **********************")
              Rails.logger.debug("Your check ignorance didnt give any result. Please check your spelling")
              Rails.logger.debug("The format should be: client_name1:check_name1,client_name2:check_name2,...")
            end
            sensu_filtered_events = ignored_check_filtered_events
          end
        else
          sensu_filtered_events = sensu_events_response
        end

        #Keep all output values in the arrays bellow
        values_array = Array.new
        max = sensu_filtered_events.size
        all_messages = ""
        for i in 0..max-1
          values_array.insert(0, sensu_filtered_events[i]["status"])
          all_messages = all_messages + "CLIENT: #{sensu_filtered_events[i]["client"]}<br/>CHECK: #{sensu_filtered_events[i]["check"]}<br/>MESSAGE: #{sensu_filtered_events[i]["output"]}<br/>"
        end
                
        case !values_array.empty?
        when values_array.include?(2)
          value = 2
        when values_array.include?(1)
          value = 1
        when values_array.include?(0)
          value = 0
        else
          Rails.logger.debug("**********************Sensu data source WARNING **********************")
          Rails.logger.debug("In your checks you have only unknown status services, please check your sensu checks")
        end
                
        {:value => value , :label => all_messages }
      end
    end
  end
end
