module Sources
  module Alert
    class File < Sources::Alert::Base

      def available?
        true 
      end

      def fields
        [
          { :name => "input_file", :title => "File to read", :mandatory => true },
        ]
      end

      def get(options = {})

        widget     = Widget.find(options.fetch(:widget_id))
        input_file = widget.settings.fetch(:input_file)

        file = open(input_file)
        json = file.read

        parsed_json = JSON.parse(json)

        values_array = []
        max = parsed_json.size
        all_messages = ""
        for i in 0..max-1
          values_array.push(parsed_json[i]["status"])
          all_messages = all_messages + "#{parsed_json[i]["Label"]} #{parsed_json[i]["Value"]}<br/>"
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
            Rails.logger.debug("Error getting status from file")
          end
        else
          value = 0
          all_messages = "Status: OK"
        end

        {:value => value , :label => all_messages }

      end

    end
  end
end
