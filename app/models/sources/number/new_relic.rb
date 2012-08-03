module Sources
  module Number
    class Demo < Sources::Number::Base

      def get(options = {})
        { :value => NewRelicConnection.instance.threshold_value('CPU') }
      end

    end
  end
end