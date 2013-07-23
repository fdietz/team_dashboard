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
        build_json_response(parsed_json)
      end

    end
  end
end
