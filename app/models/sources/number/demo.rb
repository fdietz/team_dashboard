module Sources
  module Number
    class Demo < Sources::Number::Base

      def initialize
      end

      def get(targets, aggregate_function, at)
        latest_datapoint(::DemoHelper.generate_datapoints(at-600, at)).first
      end

    end
  end
end