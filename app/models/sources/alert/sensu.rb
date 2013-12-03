module Sources
  module Alert
    class Sensu < Sources::Alert::Base

      #Define SensuConfiguration exception class
      class SensuWrongConfigurationError < Exception; end

      def available?
        Rails.configuration.sensu_events.present?
      end

      def custom_fields
        [
          { :name => "sensu_clients", :title => "Filter by clients", :mandatory => false },
          { :name => "ignored_checks", :title => "Ignore checks", :mandatory => false }
        ]
      end

      def get(options = {})
        widget                = Widget.find(options.fetch(:widget_id))
        sensu_client_filter   = widget.settings.fetch(:sensu_clients, '')
        sensu_ignored_checks  = widget.settings.fetch(:ignored_checks, '')

        #defining some global variables that will be used to store filtered data
        sensu_filtered_events = []
        ignored_check_filtered_events = []

        #Initial values for the alert system
        message = "Unknown Subsystem Status!"
        value = 500

        sensu_events_url = Rails.configuration.sensu_events.to_s + "/events"
        sensu_events_response = ::HttpService.request(sensu_events_url)

        sensu_client_filter = sensu_client_filter.to_s
        sensu_ignored_checks = sensu_ignored_checks.to_s

        #If both fields have data
        if (sensu_client_and_check_filters_filled?(sensu_client_filter,sensu_ignored_checks))

          #Here we will keep the clients for filtering, if any...
          clients_array = sensu_client_filter.split(',')

          #Here we will keep the ignored checks for filtering, if any...
          ignored_checks_array = sensu_ignored_checks.split(',').map do
            |clietnt_check|
            client_name, check = clietnt_check.split(":")
            {:client_name => client_name, :check => check }
          end

          #Here we do the filtering by client for every event
          sensu_events_response.each do |event|
            clients_array.each do |client|
              if (event["client"].eql?(client))
                sensu_filtered_events.push(event)
                break
              end
            end
          end

          if (sensu_filtered_events.empty?)
            raise SensuWrongConfigurationError.new("WARNING: The client filters that you entered doesn't exist in the sensu event list!")
            return
          else
            sensu_filtered_events.each do |event|
              ignored_checks_array.each do |ignored_check|
                if (the_check_that_you_try_to_ignore_exists?(event,ignored_check))
                  Rails.logger.debug("Sensu: Check: #{ignored_check[:check]} from Client: #{ignored_check[:client_name]} ignorred\n")
                else
                  ignored_check_filtered_events.push(event)
                end
              end
            end
            if (sensu_filtered_events.size == ignored_check_filtered_events.size)
              raise SensuWrongConfigurationError.new("WARNING: Your check ignorance didnt give any result. Please check your spelling! The format should be: client_name1:check_name1, ...")
            end
            sensu_filtered_events = ignored_check_filtered_events
          end


          #If only client_filter is filled
        elsif (!sensu_client_filter.empty?)
          #Here we will keep the clients for filtering if any
          clients_array = sensu_client_filter.split(',')

          #Here we do the filtering by client for every event
          sensu_events_response.each do |event|
            clients_array.each do |client|
              if (event["client"].eql?(client))
                sensu_filtered_events.push(event)
                break
              end
            end
          end

          if (sensu_filtered_events.empty?)
            raise SensuWrongConfigurationError.new("WARNING: The client filters that you entered doesnt exist in the sensu event list!")
            return
          end

          #If only a boring checks are filtered
        elsif (!sensu_ignored_checks.empty?)

          #Here we will keep the ignored checks for filtering, if any...
          ignored_checks_array = sensu_ignored_checks.split(',').map do
            |clietnt_check|
            client_name, check = clietnt_check.split(":")
            {:client_name => client_name, :check => check }
          end

          if (sensu_events_response.empty?)
            raise SensuWrongConfigurationError.new("WARNING: The list of sensu events is empty please check your sensu configuration!")
            return
          else
            sensu_events_response.each do |event|
              ignored_checks_array.each do |ignored_check|
                if (the_check_that_you_try_to_ignore_exists?(event,ignored_check))
                  Rails.logger.debug("Sensu: Check: #{ignored_check[:check]} from Client: #{ignored_check[:client_name]} ignorred\n")
                else
                  ignored_check_filtered_events.push(event)
                end
              end
            end
            if (sensu_events_response.size == ignored_check_filtered_events.size)
              raise SensuWrongConfigurationError.new("WARNING: Your check ignorance didnt give any result. Please check your spelling! The format should be: client_name1:check_name1, ...")
            end
            sensu_filtered_events = ignored_check_filtered_events
          end
        else
          sensu_filtered_events = sensu_events_response
        end

        #Keep all output values in the arrays bellow
        values_array = []
        max = sensu_filtered_events.size
        all_messages = ""
        for i in 0..max-1
          values_array.push(sensu_filtered_events[i]["status"])
          all_messages = all_messages + "CLIENT: #{sensu_filtered_events[i]["client"]}<br/>CHECK: #{sensu_filtered_events[i]["check"]}<br/>MESSAGE: #{sensu_filtered_events[i]["output"]}<br/>"
        end

        if !values_array.empty?
          value = case
          when values_array.include?(2)
            2
          when values_array.include?(1)
            1
          when values_array.include?(0)
            0
          else
            Rails.logger.debug("**********************Sensu data source WARNING **********************")
            Rails.logger.debug("In your checks you have only unknown status services, please check your sensu checks")
          end
        else
          value = 0
          all_messages = "SESNSU System status: OK"
        end

        {:value => value , :label => all_messages }
      end

      def sensu_client_and_check_filters_filled?(sensu_client_filter,sensu_ignored_checks)
        (!sensu_client_filter.empty? && !sensu_ignored_checks.empty?)
      end

      def the_check_that_you_try_to_ignore_exists?(event,ignored_check)
        (event["client"].eql?(ignored_check[:client_name]) && event["check"].eql?(ignored_check[:check]))
      end

    end
  end
end
