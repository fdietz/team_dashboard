module Sources
  module Number
    class NewRelic < Sources::Number::Base

      def available?
        true
      end

      def supports_target_browsing?
        false
      end

      def supports_functions?
        false
      end

      def fields
        [
          { :name => "api_key", :title => "Api Key", :mandatory => true },
          { :name => "value_name", :title => "Value Name", :mandatory => true },
        ]
      end

      def get(options = {})
        api_key = options.fetch(:fields).fetch(:api_key)
        value_name = options.fetch(:fields).fetch(:value_name)
        { :value => NewRelicConnection.instance(api_key).threshold_value(value_name).metric_value }
      end

      private

      def resolve_value(document, value_path)
        paths = value_path.split(".");
        current_element = document
        paths.each do |path|
          current_element = current_element[path]
        end
        current_element
      end

    end
  end
end