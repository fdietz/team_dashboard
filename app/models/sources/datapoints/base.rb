module Sources
  module Datapoints
    class Base
      def get(targets, from, to, aggregate_function = nil)
      end

      protected

      def aggregated_result(result, aggregate_function)
        dps = []
        result.each { |r| dps += r['datapoints'] }
        aggregated_result = aggregate(dps, aggregate_function)
      end

      def aggregate(dps, aggregate_function)
        case aggregate_function
        when 'average'
          sum = dps.inject(0) { |result, dp| result += dp.first; result }
          sum / dps.size
        when 'sum'
          dps.inject(0) { |result, dp| result += dp.first; result }
        else
          raise ArgumentError, "Unknown aggregate function: #{aggregate_function}"
        end
      end

    end
  end
end