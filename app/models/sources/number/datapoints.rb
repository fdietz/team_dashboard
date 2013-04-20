module Sources
  module Number
    class Datapoints < Sources::Number::Base

      attr_reader :widget, :datapoints_source, :aggregate_function

      def get(options = {})
        @widget             = Widget.find(options.fetch(:widget_id))
        @datapoints_source  = widget.settings.fetch(:datapoints_source)
        @aggregate_function = widget.settings.fetch(:aggregate_function)

        request_result = request_data(options.merge(:source => @datapoints_source))
        values = aggregate(request_result)

        { value: calculate_result(values) }
      end

      def supports_target_browsing?
        true
      end

      def available_targets(options = {})
        @widget             = Widget.find(options.fetch(:widget_id))
        @datapoints_source  = widget.settings.fetch(:datapoints_source)

        plugin(@datapoints_source).available_targets(options.merge(:source => @datapoints_source))
      end

      private

      def average(values)
        values.empty? ? 0 : sum(values) / values.size
      end

      def sum(values)
        values.inject(0, &:+)
      end

      def calculate_result(values)
        case aggregate_function
        when "average"
          average(values)
        when "sum"
          sum(values)
        else
          raise "Unsupported aggregate function: #{aggregate_function}"
        end
      end

      # aggregate datapoint array of all targets into single array of datapoints
      def aggregate(request_result)
        datapoints_for_all_targets = request_result.map { |r| r["datapoints"] }
        datapoints = datapoints_for_all_targets.inject([]) { |result, v| result += v; result }
        datapoints.map { |dp| dp.first }.compact
      end

      def request_data(options)
        plugin(options[:source]).get(options)
      end

      def plugin(source)
        Sources.plugin_clazz('datapoints', source).new
      end

    end
  end
end