module Sources
  module FileInput
    class Demo < Sources::FileInput::Base

      def available?
        true 
      end

      def get(options = {})

        widget     = Widget.find(options.fetch(:widget_id))
        input_file = Rails.root.join('vendor', 'demo_file_input.json')

        file = open(input_file)
        json = file.read

        parsed_json = JSON.parse(json)

        values_array = []
        max = parsed_json.size
        all_messages = Array.new
        for i in 0..max-1
          values_array.push(parsed_json[i]["status"])
          all_messages << {:label => "#{parsed_json[i]["Label"]}", :value => "#{parsed_json[i]["Value"]}"}
        end
        Rails.logger.debug("all_messages = #{all_messages}")
        Rails.logger.debug("all_messages = #{all_messages.to_s}")

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

        { :overall_value => overall_value , :label => all_messages }

      end

    end
  end
end
