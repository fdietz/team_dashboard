module Sources
  module StatusTable
    class JsonFile < Sources::StatusTable::Base

      def available?
        true
      end

      def custom_fields
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

        build_json_response(parsed_json)
      end

    end
  end
end
