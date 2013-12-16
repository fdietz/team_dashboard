module Sources
  module StatusTable
    class Base

      def available?
        true
      end

      def supports_target_browsing?
        false
      end

      def supports_functions?
        false
      end

      def default_fields
        []
      end

      def custom_fields
        []
      end

      # Returns ruby hash:
      def get(options = {})
      end

      def build_json_response(parsed_json)
        values_array = []
        max = parsed_json.size
        all_messages = Array.new

        for i in 0..max-1
          values_array.push(parsed_json[i]["status"])
          all_messages << {
            "status" => "#{parsed_json[i]["status"]}",
            "label" => "#{parsed_json[i]["label"]}",
            "value" => "#{parsed_json[i]["value"]}"
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

        if overall_value == 2
          first_value = all_messages.find {|s| s["status"] == "2"}
        elsif overall_value == 1
          first_value = all_messages.find {|s| s["status"] == "1"}
        elsif overall_value == 0
          first_value = all_messages.find {|s| s["status"] == "0"}
        else
          Rails.logger.debug("Error getting first_value")
          first_value = ""
        end

        { :overall_value => overall_value, :first_value => first_value, :label => all_messages }
      end

    end
  end
end
