module Sources
  module StatusTable
    class Demo < Sources::StatusTable::Base

      def available?
        true 
      end

      def get(options = {})

        input_file = Rails.root.join('vendor', 'demo_status_table.json')

        file = open(input_file)
        json = file.read

        parsed_json = JSON.parse(json)

        values_array = []
        max = parsed_json.size
        all_messages = Array.new
        for i in 0..max-1
          values_array.push(parsed_json[i]["status"])
          all_messages << {
            :status => "#{parsed_json[i]["status"]}",
            :label => "#{parsed_json[i]["label"]}",
            :value => "#{parsed_json[i]["value"]}"
          }
        end

        if !values_array.empty?
          overall_value = case
            when values_array.include?(2)
              2
            when values_array.include?(1)
              1
            when values_array.include?(0)
              0
            else
              Rails.logger.debug("Error getting status from file")
          end
        else
          overall_value = 0
        end

        #if overall_value = 2, choose a random item with a status of 2 to be first_value, and so on
        #if overall_value == 2
        #  first_value = Hash[*all_messages.sample(1)]
          #first_value = all_messages.select{ |status| status == 2 }.sample(1)
          #overall_value_2 = all_messages.select{ |status| status == 2 }
          #first_value = Hash[*overall_value_2.to_a.sample(1)]
        #else
        #  Rails.logger.debug("Error getting first_value")
        #end

        #{ :overall_value => overall_value, :first_value => first_value, :label => all_messages }
        { :overall_value => overall_value, :label => all_messages }

      end

    end
  end
end
