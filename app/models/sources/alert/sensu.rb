module Sources
  module Alert
    class Sensu < Sources::Alert::Base

      #Define SensuConfiguration exception class
      class SensuWrongConfigurationError < Exception; end

      def available?
        BackendSettings.secrets.sensu_url.present?
      end

      def custom_fields
        [
          { :name => "sensu_clients", :title => "Filter by clients", :mandatory => false },
          { :name => "ignored_checks", :title => "Ignore checks", :mandatory => false }
        ]
      end

      def get_events(clients = [])
        sensu_events_url = BackendSettings.secrets.sensu_url + "/events"
        sensu_events = []
        if clients.empty?
          # no clients listed, use the global event endpoint
          response = ::HttpService.request(sensu_events_url)
          Rails.logger.debug("Loaded #{response.length} global sensu events")
          response.each do |event|
            sensu_events.push(event)
          end
        else
          # if clients are listed, use the dedicated per-client event endpoint
          clients.each do |client|
            response = ::HttpService.request(sensu_events_url + "/" + client)
            Rails.logger.debug("Loaded #{response.length} sensu events from #{client}")
            response.each do |event|
              Rails.logger.debug("Added sensu event from")
              sensu_events.push(event)
            end
          end
        end
        sensu_events
      end

      def filter_events(events, ignored_checks)
        if ignored_checks.empty?
          events
        else
          result = []
          events.each do |event|
            ignore = false
            ignored_checks.each do |ignored_check|
              if (the_check_that_you_try_to_ignore_exists?(event,ignored_check))
                Rails.logger.debug("Sensu: Check: #{ignored_check[:check]} from Client: #{ignored_check[:client_name]} ignorred\n")
                ignore = true
                break
              end
            end
            if not ignore
              result.push(event)
            end
          end
          Rails.logger.debug("RETURNING #{result.length} EVENTS")
          result
        end
      end

      def get(options = {})
        widget = Widget.find(options.fetch(:widget_id))

        sensu_client_filter = widget.settings.fetch(:sensu_clients, '')
        unfiltered_events = get_events(sensu_client_filter.to_s.split(','))

        sensu_ignored_checks  = widget.settings.fetch(:ignored_checks, '')
        ignored_checks_array = sensu_ignored_checks.to_s.split(',').map do
          |client_check|
          client_name, check = client_check.split(":")
          {:client_name => client_name, :check => check }
        end

        filtered_events = filter_events(unfiltered_events, ignored_checks_array)
        Rails.logger.debug("Filtered to #{filtered_events.length} Sensu events")

        #Initial values for the alert system
        value = 500

        #Keep all output values in the arrays bellow
        values_array = []
        max = filtered_events.size
        all_messages = ""
        for i in 0..max-1
          values_array.push(filtered_events[i]["status"])
          all_messages = all_messages + "CLIENT: #{filtered_events[i]["client"]}<br/>CHECK: #{filtered_events[i]["check"]}<br/>MESSAGE: #{filtered_events[i]["output"]}<br/>"
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
          all_messages = "SENSU System status: OK"
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
