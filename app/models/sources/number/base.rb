module Sources
  module Number
    class Base
      def get(targets, aggregate_function, at)
      end

      protected

      def aggregate(dps, aggregate_function)
        case aggregate_function
        when 'average'
          sum = dps.inject(0) { |result, dp| result += dp.first; result }
          sum / dps.size
        when 'sum'
          dps.inject(0) { |result, dp| result += dp.first; result }
        end
      end

      def latest_datapoint(dps)
        dps.reject { |dp| dp.first.nil? }.sort { |a, b| b.last <=> a.last }.first
      end

    end
  end
end